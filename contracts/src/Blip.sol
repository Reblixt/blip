// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

// import {IERC20} from "forge-std/interfaces/IERC20.sol";

// Swish alternative
contract Blip {
    constructor() {
    paymentStatus = PaymentStatus.Idle;
    recipientAddress = msg.sender;
}

    // event RecipientSet(address recipientAddress);
    event GuardianAdded(address recipientAddress, address guardianAddress);
    event GuardianRemoved(address recipientAddress, address guardianAddress);

    event PaymentInitiated(address senderAddress, uint amount);
    event PaymentSigned(address signerAddress, uint amount);
    event PaymentRejected(address signerAddress, uint amount);
    event PaymentRefunded(address senderAddress, uint amount);
    event PaymentReleased(address recipientAddress, uint amount);

    enum PaymentStatus { Idle, Pending, Approved, Rejected }
    PaymentStatus public paymentStatus;

    // struct Payment {
    //     uint256 id;
    //     address sender;
    //     PaymentStatus status;
    //     uint amount;
    //     mapping(address => bool) approvedBy;
    // }

    address public recipientAddress;
    address public senderAddress;
    uint public amount;

    address[] public guardians;
    // mapping(uint id => Payment) public payments;
    mapping(address => bool) public guardiansMap;
    mapping(address => bool) approvedGuardians;

    //Init

    function initPayment() external payable {
        // Minst en guardian behöver vara satt
        require(guardians.length > 0, "No guardians set");
        // Inga uppdateringar under aktiv betalning
        require(paymentStatus == PaymentStatus.Idle, "Payment already active");
        // 0 är inte giltigt belopp
        require(msg.value > 0, "0 is not a valid payment amount");

        senderAddress = msg.sender;
        amount = msg.value;
        paymentStatus = PaymentStatus.Pending;

        // Event-logg
        emit PaymentInitiated(msg.sender, msg.value);
    }

    function addGuardian(address newGuardian) external {
        // Endast mottagaren kan ändra
        require(msg.sender == recipientAddress, "Only the recipient can add guardians");
        // Redan guardian
        require(!guardiansMap[newGuardian], "Guardian already in list");
        // Inga uppdateringar under aktiv betalning (escrow måste vara stilla)
        require(paymentStatus != PaymentStatus.Pending, "Cannot change guardians during payment");
        // sätt i mapping
        guardiansMap[newGuardian] = true;
        // lägg till i arrayen
        guardians.push(newGuardian);
        // initiera approval
        approvedGuardians[newGuardian] = false;

        // event-logga att mottagaren har uppdaterat listan
        emit GuardianAdded(msg.sender, newGuardian);
        
    }

        function removeGuardian(address oldGuardian) external {
        // Endast mottagaren kan ändra
        require(msg.sender == recipientAddress, "Only the recipient can add guardians");
        // Redan guardian
        require(guardiansMap[oldGuardian], "Guardian not in list");
        // Inga uppdateringar under aktiv betalning (escrow måste vara stilla)
        require(paymentStatus != PaymentStatus.Pending, "Cannot change guardians during payment");
        // Ta bort från mapping
        guardiansMap[oldGuardian] = false;
        // Ta bort från approval
        approvedGuardians[oldGuardian] = false;
        // Remove from array
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

    function refundPayment() public {
        // Kontrollera att betalningen faktiskt är Pending eller Rejected
        require(paymentStatus == PaymentStatus.Pending || paymentStatus == PaymentStatus.Rejected, "Payment is not pending or rejected");

        uint refundAmount = amount;
        address refundTo = senderAddress; // spara till event

        // Skicka pengarna tillbaka till avsändaren
        payable(refundTo).transfer(refundAmount);

        // Nollställ inför nästa betalning
        amount = 0;
        senderAddress = address(0);

        // Uppdatera betalningsstatus
        paymentStatus = PaymentStatus.Idle;

        // Event-logga att betalningen har skickats tillbaka
        emit PaymentRefunded(refundTo, refundAmount);

        // Nollställ guardians
        for (uint i = 0; i < guardians.length; i++) {
        approvedGuardians[guardians[i]] = false;
        }


    }

    function releasePayment() public {
        // Kontrollera att betalningen är Approved
        require(
            paymentStatus == PaymentStatus.Approved,
            "Payment is not approved"
        );

        // Har kontraktet tillräckligt med pengar?
        require(address(this).balance >= amount, "Insufficient contract balance");

        uint paymentAmount = amount;
        address recipient = recipientAddress;

        // Skicka pengarna till mottagaren
        payable(recipient).transfer(paymentAmount);

        // Nollställ inför nästa betalning
        amount = 0;
        senderAddress = address(0);

        // Uppdatera betalningsstatus
        paymentStatus = PaymentStatus.Idle;

        // Event-logga att betalningen har släppts
        emit PaymentReleased(recipient, paymentAmount);

        // Nollställ guardians
        for (uint i = 0; i < guardians.length; i++) {
        approvedGuardians[guardians[i]] = false;
        }

    }


    // Signers

    function approvePayment() external {
        // Kontrollera att avsändaren är en guardian
        require(guardiansMap[msg.sender], "Signer is not a valid guardian");

        // Kontrollera att betalningen är pending
        require(
            paymentStatus == PaymentStatus.Pending,
            "Payment is not pending"
        );

        // Kontrollera att guardian inte redan godkänt
        require(!approvedGuardians[msg.sender], "Signer has already approved");

        // spara värdet till event
        uint paymentAmount = amount;

        // Lägg till guardian i listan över godkända guardians
        // Bör vara mapping
        approvedGuardians[msg.sender] = true;

        // Om tillräckligt många har godkänt
        if (getSignerStatus() == PaymentStatus.Approved) {
            // Sätt betalningsstatus till approved
            paymentStatus = PaymentStatus.Approved;
            // Skicka ut pengarna
            releasePayment();
        }

        // Event-logga att betalningen har godkännts
        emit PaymentSigned(msg.sender, paymentAmount);

    }

    function rejectPayment() external {
        // Kontrollera att personen som anropar är en guardian
        require(guardiansMap[msg.sender], "Signer is not a valid guardian");

         // Kontrollera att betalningen är Pending
         require(paymentStatus == PaymentStatus.Pending, "Payment is not pending");

         uint paymentAmount = amount;

        // Sätt betalningsstatus till rejected
        paymentStatus = PaymentStatus.Rejected;

        // Skicka tillbaka pengarna till avsändaren
        refundPayment();

         // Event-logga att betalningen har avvisats
         emit PaymentRejected(msg.sender, paymentAmount);

    }

    function getSignerStatus() public view returns (PaymentStatus) {
        // Returnerar om tillräckligt många signers har godkänt
        if (guardians.length == 0) return PaymentStatus.Idle;

        uint approvedCount = 0;
        for (uint i = 0; i < guardians.length; i++) {
            if (approvedGuardians[guardians[i]]) {
                approvedCount++;
            }
        }

        if (approvedCount == guardians.length && guardians.length > 0) {
            // Alla guardians måste godkänt
            return PaymentStatus.Approved;
        }

        return PaymentStatus.Pending;
    }

    receive() external payable {
        revert("Direct payments not allowed");
    }

    fallback() external payable {
        revert("Direct transfers not allowed");
    }
}
