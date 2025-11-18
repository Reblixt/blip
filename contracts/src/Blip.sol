// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

// import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Swish alternative
contract Blip {
    using SafeERC20 for IERC20;

    constructor() {
        recipientAddress = msg.sender;
    }

    modifier hasGuardians() {
        if (guardians.length == 0) revert NoGuardiansSet();
        _;
    }

    modifier hasValidAmount(uint256 _amount) {
        if (_amount == 0) revert InvalidAmount();
        _;
    }

    modifier isPendingGuardian(address _guardian) {
        require(pendingGuardians[_guardian], GuardianNotPending());
        _;
    }

    modifier onlyRecipient() {
        require(msg.sender == recipientAddress, NotRecipient());
        _;
    }

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

    event GuardianProposed(
        address indexed recipient,
        address indexed proposedGuardian
    );
    event GuardianAdded(
        address indexed recipientAddress,
        address indexed guardianAddress
    );
    event GuardianDeclinedRole(
        address indexed recipient,
        address indexed guardian
    );
    event GuardianLeftRole(address indexed recipient, address indexed guardian);
    event GuardianProposalCancelled(
        address indexed recipient,
        address indexed guardian
    );
    event GuardianRemoved(address recipientAddress, address guardianAddress);

    event PaymentInitiated(uint256 indexed paymentId, address indexed senderAddress, address indexed recipient, uint amount, address tokenAddress,  string message);
    event PaymentSigned(uint256 indexed paymentId, address signerAddress, uint amount);
    event PaymentRejected(uint256 indexed paymentId, address signerAddress, uint amount);
    event PaymentRefunded(uint256 indexed paymentId, address senderAddress, uint amount);
    event PaymentReleased(uint256 indexed paymentId, address recipientAddress, uint amount);

    enum PaymentStatus {
        Pending,
        SentBack,
        Approved,
        Rejected,
        Completed
    }

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

    address public recipientAddress;

    address[] public guardians;
    mapping(address => bool) public guardiansMap;
    mapping(address => bool) public pendingGuardians;

    function initPayment(string memory _message) external payable hasGuardians hasValidAmount(msg.value){
        _createPayment(address(0), msg.value, _message);
    }

    function initPayment(
        address _tokenAddress,
        uint256 _amount,
        string memory _message
    ) external hasGuardians hasValidAmount(_amount) {
        if (_tokenAddress == address(0)) revert InvalidAddress();

        // IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);

          IERC20(_tokenAddress).safeTransferFrom(msg.sender, address(this), _amount);

        _createPayment(_tokenAddress, _amount, _message);
    }

        function _createPayment(
        address _tokenAddress,
        uint256 _amount,
        string memory _message
    ) internal {
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
        newPayment.approvalCount = 0;

        paymentCounter++;

        // borde createPayment anropa releasePayment() om guardianCount == 0?
        emit PaymentInitiated(newPayment.id, msg.sender, recipientAddress, _amount, _tokenAddress,_message);
    }

    // function directPayment(string memory _message) external payable {
    //     if (msg.value == 0) revert InvalidAmount();

    //     if (_tokenAddress == address(0)) revert InvalidAddress();

    //    Payment storage newPayment = payments[paymentCounter];
    //     newPayment.id = paymentCounter;
    //     newPayment.sender = msg.sender;
    //     newPayment.tokenAddress = address(0);
    //     newPayment.guardianCount = 0;
    //     newPayment.receiver = recipientAddress;
    //     newPayment.amount = msg.value;
    //     newPayment.message = _message;
    //     newPayment.timestamp = block.timestamp;
    //     newPayment.status = PaymentStatus.Completed;

    //     paymentCounter++;

    //     payable(recipientAddress).transfer(msg.value);

    //     emit PaymentReleased(recipientAddress, msg.value);

    // }

    // function directPayment(address _tokenAddress, uint256 _amount, string memory _message) external {
    //     if (_tokenAddress == address(0)) revert InvalidAddress();
    //     if (_amount == 0) revert InvalidAmount();

    //     IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);

    //    Payment storage newPayment = payments[paymentCounter];
    //     newPayment.id = paymentCounter;
    //     newPayment.sender = msg.sender;
    //     newPayment.tokenAddress = _tokenAddress;
    //     newPayment.guardianCount = 0;
    //     newPayment.receiver = recipientAddress;
    //     newPayment.amount = _amount;
    //     newPayment.message = _message;
    //     newPayment.timestamp = block.timestamp;
    //     newPayment.status = PaymentStatus.Completed;

    //     paymentCounter++;

    //     IERC20 paymentToken = IERC20 (_tokenAddress);
    //     paymentToken.transfer(recipientAddress, _amount);

    //     emit PaymentReleased(recipientAddress, _amount);
    // }

    function proposeGuardian(address newGuardian) external onlyRecipient {
        require(newGuardian != address(0), InvalidAddress());
        require(newGuardian != recipientAddress, RecipientCannotBeGuardian());
        require(!guardiansMap[newGuardian], GuardianAlreadyExist());
        require(!pendingGuardians[newGuardian], GuardianAlreadyPending());

        pendingGuardians[newGuardian] = true;

        emit GuardianProposed(msg.sender, newGuardian);
    }

    function cancelGuardianProposal(
        address newGuardian
    ) external onlyRecipient isPendingGuardian(newGuardian) {
        pendingGuardians[newGuardian] = false;

        emit GuardianProposalCancelled(recipientAddress, newGuardian);
    }

    function acceptGuardianRole() external isPendingGuardian(msg.sender) {
        pendingGuardians[msg.sender] = false;
        guardiansMap[msg.sender] = true;
        guardians.push(msg.sender);

        emit GuardianAdded(recipientAddress, msg.sender);
    }

    function declineGuardianRole() external isPendingGuardian(msg.sender){
        pendingGuardians[msg.sender] = false;

        emit GuardianDeclinedRole(recipientAddress, msg.sender);
    }

    function leaveGuardianRole() external {
        require(guardiansMap[msg.sender], GuardianDoesNotExist());

        guardiansMap[msg.sender] = false;
        removeFromArray(msg.sender);

        emit GuardianLeftRole(recipientAddress, msg.sender);
    }

    function removeGuardian(address oldGuardian) external onlyRecipient {
        require(guardiansMap[oldGuardian], GuardianDoesNotExist());

        guardiansMap[oldGuardian] = false;
        removeFromArray(oldGuardian);

        emit GuardianRemoved(msg.sender, oldGuardian);
    }

    function removeFromArray(address guardian) internal {
        for (uint i = 0; i < guardians.length; i++) {
            if (guardians[i] == guardian) {
                guardians[i] = guardians[guardians.length - 1];
                guardians.pop();
                break;
            }
        }
    }

    function approvePayment(uint256 _paymentId) external {
        require(
            payments[_paymentId].status == PaymentStatus.Pending,
            PaymentNotPending()
        );
        require(
            !payments[_paymentId].approvedBy[msg.sender],
            SignerAlreadyApproved()
        );
        require(
            payments[_paymentId].requiredApprovals[msg.sender] == true,
            NotASigner()
        );


        uint paymentAmount = payments[_paymentId].amount;
        payments[_paymentId].approvedBy[msg.sender] = true;
        payments[_paymentId].approvalCount++;

        if (
            payments[_paymentId].approvalCount ==
            payments[_paymentId].guardianCount
        ) {
            payments[_paymentId].status = PaymentStatus.Approved;

            releasePayment(_paymentId);
        }

        emit PaymentSigned(_paymentId, msg.sender, paymentAmount);
    }

    function releasePayment(uint256 _paymentId) internal {
        require(
            payments[_paymentId].status == PaymentStatus.Approved,
            PaymentNotApproved()
        );

        address tokenAddress = payments[_paymentId].tokenAddress;
        uint paymentAmount = payments[_paymentId].amount;
        address recipient = payments[_paymentId].receiver;

        if (tokenAddress == address(0)) {
            require(
                address(this).balance >= paymentAmount,
                InsufficientContractBalance()
            );
            payable(recipient).transfer(paymentAmount);
        } else {
            IERC20 paymentToken = IERC20(tokenAddress);
            require(
                paymentToken.balanceOf(address(this)) >= paymentAmount,
                InsufficientContractBalance()
            );
            paymentToken.safeTransfer(recipient, paymentAmount);
        }

        payments[_paymentId].status = PaymentStatus.Completed;

        emit PaymentReleased(_paymentId, recipient, paymentAmount);
    }

    function hasApproved(
        uint256 _paymentId,
        address _guardian
    ) external view returns (bool) {
        return payments[_paymentId].approvedBy[_guardian];
    }

    function cancelPendingPayment(uint256 _paymentId) external onlyRecipient {
        require(
            payments[_paymentId].status == PaymentStatus.Pending,
            PaymentNotPending()
        );

        uint paymentAmount = payments[_paymentId].amount; 

        refundPayment(_paymentId, paymentAmount);
    }

    function refundPayment(uint256 _paymentId, uint256 _amount) internal {
        require(
            payments[_paymentId].status == PaymentStatus.Pending ||
                payments[_paymentId].status == PaymentStatus.Rejected,
            PaymentNotPending()
        );

        address refundTo = payments[_paymentId].sender;
        address tokenAddress = payments[_paymentId].tokenAddress;

        if (tokenAddress == address(0)) {
            require(
                address(this).balance >= _amount,
                InsufficientContractBalance()
            );
            payable(refundTo).transfer(_amount);
        } else {
            IERC20 paymentToken = IERC20(tokenAddress);
            require(
                paymentToken.balanceOf(address(this)) >= _amount,
                InsufficientContractBalance()
            );

            paymentToken.safeTransfer(refundTo, _amount);
        }

        payments[_paymentId].status = PaymentStatus.SentBack;

        emit PaymentRefunded(_paymentId, refundTo, _amount);
    }

    function rejectPayment(uint256 _paymentId) external {
        require(
            payments[_paymentId].status == PaymentStatus.Pending,
            PaymentNotPending()
        );
        require(
            payments[_paymentId].requiredApprovals[msg.sender] == true,
            NotASigner()
        );

        uint paymentAmount = payments[_paymentId].amount;

        payments[_paymentId].status = PaymentStatus.Rejected;

        emit PaymentRejected(_paymentId, msg.sender, paymentAmount);

        refundPayment(_paymentId, paymentAmount);
    }

    function getPayment(
        uint256 _id
    )
        external
        view
        returns (
            uint256 id,
            address sender,
            address receiver,
            uint256 amount,
            string memory message,
            uint256 timestamp,
            PaymentStatus status
        )
    {
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
