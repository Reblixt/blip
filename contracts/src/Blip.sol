// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Swish alternative
contract Blip {

    constructor() {
    recipientAddress = msg.sender;
    }

    modifier onlyRecipient() {
        require(msg.sender == recipientAddress, NotRecipient());
        _;
    }

    // errors
    error NoGuardiansSet();
    error InvalidAmount();
    error InsufficientContractBalance();
    error InvalidAddress();
    error NotRecipient();
    error RecipientCannotBeGuardian();
    error GuardianAlreadyExist();
    error GuardianDoesNotExist();
    error GuardianAlreadyPending();
    error GuardianNotPending();
    error NotASigner();
    error PaymentNotPending();
    error PaymentNotApproved();
    error SignerAlreadyApproved();
    error DirectPaymentsNotAllowed();

    // event RecipientSet(address recipientAddress);
    event GuardianProposed(address indexed recipient, address indexed proposedGuardian);
    event GuardianAdded(address recipientAddress, address guardianAddress);
    event GuardianDeclinedRole(address indexed recipient, address indexed guardian);
    event GuardianLeftRole(address indexed recipient, address indexed guardian);
    event GuardianProposalCancelled(address indexed recipient, address indexed guardian);
    event GuardianRemoved(address recipientAddress, address guardianAddress);

    event PaymentInitiated(address senderAddress, uint amount);
    event PaymentSigned(address signerAddress, uint amount);
    event PaymentRejected(address signerAddress, uint amount);
    event PaymentRefunded(address senderAddress, uint amount);
    event PaymentReleased(address recipientAddress, uint amount);

    enum PaymentStatus { Pending, SentBack, Approved, Rejected, Completed }

    struct Payment {
        uint256 id;
        address sender;
        address receiver;
        address tokenAddress;
        uint256 amount;
        string message;
        uint256 timestamp;
        PaymentStatus status;
        uint256 guardianCount; // Hur många behövs
        uint256 approvalCount; // Hur många har godkänt hittills
        mapping(address => bool) approvedBy; // Vem har godkänt
        mapping(address => bool) requiredApprovals; // Vem får godkänna
    }

    mapping(uint256 => Payment) public payments;
    uint256 public paymentCounter = 0;

    IERC20 public token;

    address public recipientAddress;

    address[] public guardians;
    mapping(address => bool) public guardiansMap;
    mapping(address => bool) public pendingGuardians;

    //Init

    // Guardians tar bort sig själva


    function initPayment(string memory _message) external payable {
    // 0 är inte giltigt belopp
    if (msg.value == 0) revert InvalidAmount();

    //Anropa helper
    _createPayment(address(0), msg.value, _message);
    }

    function initPayment(address _tokenAddress, uint256 _amount, string memory _message) external {
        // 0 är inte giltigt belopp
        if (_amount == 0) revert InvalidAmount();

        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount); 
        
        _createPayment(_tokenAddress, _amount, _message);
    }

    function _createPayment(address _tokenAddress, uint256 _amount, string memory _message) internal {
        // Minst en guardian behöver vara satt
        if (guardians.length == 0) revert NoGuardiansSet();
        // Hämta referens till betalningen i storage
        Payment storage newPayment = payments[paymentCounter];
        newPayment.id = paymentCounter;
        newPayment.sender = msg.sender;
        newPayment.tokenAddress = _tokenAddress;
        newPayment.receiver = recipientAddress;
        newPayment.amount = _amount;
        newPayment.message = _message;
        newPayment.timestamp = block.timestamp;
        newPayment.status = PaymentStatus.Pending;

        for (uint i = 0; i < guardians.length; i++) {
        newPayment.requiredApprovals[guardians[i]] = true;
        }

        newPayment.guardianCount = guardians.length;
        newPayment.approvalCount = 1;
    
        paymentCounter++;

        // Event-logg
        emit PaymentInitiated(msg.sender, _amount);
    
    }

    function proposeGuardian(address newGuardian) external onlyRecipient {
        // Ogiltig address
        require(newGuardian != address(0), InvalidAddress());
        // Recipient kan inte vara guardian
        require(newGuardian != recipientAddress, RecipientCannotBeGuardian());  // Vilket error?
        // Redan aktiv guardian
        require(!guardiansMap[newGuardian], GuardianAlreadyExist());
        // Redan pending guardian
        require(!pendingGuardians[newGuardian], GuardianAlreadyPending());
        // Sätt som pending
        pendingGuardians[newGuardian] = true;
        
        
        emit GuardianProposed(msg.sender, newGuardian);
    }

    function cancelGuardianProposal(address newGuardian) external onlyRecipient {
        // är guardian markerad som pending?
        require(pendingGuardians[newGuardian], GuardianNotPending());

        // Ta bort från mapping
        pendingGuardians[newGuardian] = false;

        emit GuardianProposalCancelled(recipientAddress, newGuardian);
    }

    function acceptGuardianRole() external {
        // är msg.sender markerad som pending guardian?
        require(pendingGuardians[msg.sender], GuardianNotPending());
         // Ta bort från pending-mapping
        pendingGuardians[msg.sender] = false;
        // sätt i mapping
        guardiansMap[msg.sender] = true;
        // lägg till i arrayen
        guardians.push(msg.sender);

        emit GuardianAdded(recipientAddress, msg.sender);  
    }

    function declineGuardianRole() external {
        // är msg.sender markerad som pending guardian?
        require(pendingGuardians[msg.sender], GuardianNotPending());
        // Ta bort från pending-mapping
        pendingGuardians[msg.sender] = false;

        emit GuardianDeclinedRole(recipientAddress, msg.sender);
    }

    function leaveGuardianRole() external {
          // Redan aktiv guardian
        require(guardiansMap[msg.sender], GuardianDoesNotExist());
            // Ta bort från mapping
        guardiansMap[msg.sender] = false;
        // Ta bort från array
        removeFromArray(msg.sender); 

        emit GuardianLeftRole(recipientAddress, msg.sender);
    }

    function removeGuardian(address oldGuardian) external onlyRecipient {
        // Redan guardian
        require(guardiansMap[oldGuardian], GuardianAlreadyExist());
        // Ta bort från mapping
        guardiansMap[oldGuardian] = false;
        // Ta bort från array
        removeFromArray(oldGuardian);  
        // event-logga att mottagaren har uppdaterat listan
        emit GuardianRemoved(msg.sender, oldGuardian); 
    }
        

    function removeFromArray(address guardian) internal {
        for (uint i = 0; i < guardians.length; i++) {
            if (guardians[i] == guardian) {
                guardians[i] = guardians[guardians.length - 1]; // byt med sista
                guardians.pop(); // ta bort sista
                break;
            }
        }
    }

    // Transaktioner

        function approvePayment(uint256 _paymentId) external {
        // Kontrollera att betalningen är pending
        require(
            payments[_paymentId].status == PaymentStatus.Pending,
            PaymentNotPending()
        );

        // Kontrollera att guardian inte redan godkänt
        require(!payments[_paymentId].approvedBy[msg.sender], SignerAlreadyApproved());

        // Var guardian när betalning skapades?
        require(
            payments[_paymentId].requiredApprovals[msg.sender] == true,
            NotASigner()
            );

        // spara värdet till event
        uint paymentAmount = payments[_paymentId].amount;

        // Markera som godkänd
        payments[_paymentId].approvedBy[msg.sender] = true;

        // Räkna uppåt
        payments[_paymentId].approvalCount++;

        // Om tillräckligt många har godkänt
        if (payments[_paymentId].approvalCount == payments[_paymentId].guardianCount) {
            // Sätt betalningsstatus till approved
            payments[_paymentId].status = PaymentStatus.Approved;
            // Skicka ut pengarna
            releasePayment(_paymentId);
        }

        // Event-logga att betalningen har godkännts
        emit PaymentSigned(msg.sender, paymentAmount);

    }

    
    function releasePayment(uint256 _paymentId) internal {
        // Kontrollera att betalningen är Approved
        require(
            payments[_paymentId].status == PaymentStatus.Approved,
            PaymentNotApproved()
        );

        address tokenAddress = payments[_paymentId].tokenAddress;
        uint paymentAmount = payments[_paymentId].amount;
        address recipient = payments[_paymentId].receiver;

        // Skicka pengarna till mottagaren
        // Native token
        if(tokenAddress == address(0) ) {
             // Har kontraktet tillräckligt med pengar?
            require(address(this).balance >= paymentAmount, InsufficientContractBalance());
            // Skicka
            payable(recipient).transfer(paymentAmount);
        // ERC20
        } else {
            IERC20 paymentToken = IERC20 (tokenAddress);
            // Har kontraktet tillräckligt med pengar?
            require(paymentToken.balanceOf(address(this)) >= paymentAmount, InsufficientContractBalance());
            // Skicka
            paymentToken.transfer(recipient, paymentAmount);
        }

        payments[_paymentId].status = PaymentStatus.Completed;

        // Event-logga att betalningen har släppts
        emit PaymentReleased(recipient, paymentAmount);

    }

    function hasApproved(uint256 _paymentId, address _guardian) external view returns(bool) {
        return payments[_paymentId].approvedBy[_guardian];

    }

    function cancelPendingPayment(uint256 _paymentId) external onlyRecipient {
        // Kontroll: Är betalningen Pending?
        require(
            payments[_paymentId].status == PaymentStatus.Pending,
            PaymentNotPending()
        );
        // Anropa internal helper
        refundPayment(_paymentId);
    }

    function refundPayment(uint256 _paymentId) internal {
        // Kontrollera att betalningen faktiskt är Pending eller Rejected
        require(payments[_paymentId].status == PaymentStatus.Pending || payments[_paymentId].status == PaymentStatus.Rejected, PaymentNotPending());

        uint refundAmount = payments[_paymentId].amount;
        address refundTo = payments[_paymentId].sender; // spara till event
        address tokenAddress = payments[_paymentId].tokenAddress;

        // Skicka pengarna tillbaka till avsändaren

        if(tokenAddress == address(0)) {
            // Har kontraktet tillräckligt med pengar?
            require(address(this).balance >= refundAmount, InsufficientContractBalance());
            // Skicka
            payable(refundTo).transfer(refundAmount);
        } else {
            IERC20 paymentToken = IERC20 (tokenAddress);
            // Har kontraktet tillräckligt med pengar?
            require(paymentToken.balanceOf(address(this)) >= refundAmount, InsufficientContractBalance());
            // Skicka
            paymentToken.transfer(refundTo, refundAmount);
        }

        // Uppdatera betalningsstatus
        payments[_paymentId].status = PaymentStatus.SentBack;

        // Event-logga att betalningen har skickats tillbaka
        emit PaymentRefunded(refundTo, refundAmount);

    }

    function rejectPayment(uint256 _paymentId) external {
        // Kontrollera att personen som anropar är en guardian

        // Kontrollera att betalningen är Pending
        require(
            payments[_paymentId].status == PaymentStatus.Pending,
            PaymentNotPending()
            );

        // Var guardian när betalning skapades?
        require(
            payments[_paymentId].requiredApprovals[msg.sender] == true,
            NotASigner()
            );

        uint paymentAmount = payments[_paymentId].amount;

        // Sätt betalningsstatus till rejected
        payments[_paymentId].status = PaymentStatus.Rejected;

        // Skicka tillbaka pengarna till avsändaren
        refundPayment(_paymentId);

         // Event-logga att betalningen har avvisats
         emit PaymentRejected(msg.sender, paymentAmount);
    }

    function getPayment(uint256 _id) external view returns ( 
        uint256 id, address sender, address receiver, uint256 amount, string memory message, uint256 timestamp, PaymentStatus status) {

        return (
            payments[_id].id,
            payments[_id].sender,
            payments[_id].receiver,
            payments[_id].amount,
            payments[_id].message,
            payments[_id].timestamp,
            payments[_id].status
            );
    }

    receive() external payable {
        revert DirectPaymentsNotAllowed();
    }

    fallback() external payable {
        revert DirectPaymentsNotAllowed();
    }
}
