// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

// Swish alternative
contract Blip {

    constructor() {
    paymentStatus = PaymentStatus.Idle;
}

    enum PaymentStatus { Idle, Pending, Approved, Rejected }
    PaymentStatus public paymentStatus;

    address public recipientAddress;
    address public senderAddress;
    uint public amount;

    address[] public guardians;
    mapping (address => bool) public guardiansMap;
    mapping (address => bool) approvedGuardians;

    //Init

    function initPayment() external payable {
        require(paymentStatus == PaymentStatus.Idle, "Payment already active");
        require(msg.value > 0, "0 is not a valid payment amount");

        for (uint i = 0; i < guardians.length; i++) {
            approvedGuardians[guardians[i]] = false; // Börja med ej godkänt
        }

        senderAddress = msg.sender;
        amount = msg.value;
        paymentStatus = PaymentStatus.Pending;
    }

    function setRecipient() external {
        // Mottagaren kan bara göra detta en gång
        require(recipientAddress == address(0), "Recipient wallet already set");
        // Sätt mottagaren
        recipientAddress = msg.sender;
        // event-logga att mottagaren har uppdaterats
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
        removeFromArray(oldGuardian)  

        // event-logga att mottagaren har uppdaterat listan
        
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

    function sendPayment() external {
        // Avsändaren skickar pengar in i kontraktet
        
        // Kontrollera att mottagaren är satt

        // Kontrollera att guardians finns

        // Pengarna går från avsändaren till kontraktet

        // Pengarna hålls tills signers godkänner betalningen

        // Skicka event-logg
    }

    function refundPayment() external {

        // Kontrollera att betalningen faktiskt är Pending eller Rejected

        // Skicka pengarna tillbaka till avsändaren

        // Nollställ variablerna så att kontraktet är redo för nästa betalning

        // Uppdatera betalningsstatus

        // Event-logga att betalningen har skickats tillbaka

    }

    function releasePayment() external {
        // Kontrollera att betalningen är Pending

        // Kontrollera om tillräckligt många guardians har godkänt

        // Skicka pengarna till mottagaren

        // Uppdatera betalningsstatus

        // Event-logga att betalningen har släppts

    }

    // Signers

    function approvePayment() external {
       // Kontrollera att avsändaren är en guardian
        require(guardiansMap[msg.sender], "Signer is not a valid guardian");

        // Kontrollera att betalningen är pending
        require(paymentStatus == PaymentStatus.Pending, "Payment is not pending");

        // Kontrollera att guardian inte redan godkänt
        require(!approvedGuardians[msg.sender], "Signer has already approved");

        // Lägg till guardian i listan över godkända guardians
        // Bör vara mapping
        approvedGuardians[msg.sender] = true;
        
        // Event-logga att personen har godkännt

        // Kontrollera om tillräckligt många har godkänt
        if (getSignerStatus() == PaymentStatus.Approved) {
            paymentStatus = PaymentStatus.Approved;

        // Event-logga att betalningen har godkännts

    }
}

    function rejectPayment() external {
         // Kontrollera att personen som anropar är en guardian
         require(guardiansMap[msg.sender], "Signer is not a valid guardian");

         // Kontrollera att betalningen är Pending
         require(paymentStatus == PaymentStatus.Pending, "Payment is not pending");

         // Sätt betalningsstatus till rejected
         paymentStatus = PaymentStatus.Rejected;

         // Skicka tillbaka pengarna till avsändaren
         refundPayment();

         // Event-logga att betalningen har avvisats

    }

    function getSignerStatus() public view returns (PaymentStatus){
        // Returnerar om tillräckligt många signers har godkänt
        if (guardians.length == 0) return PaymentStatus.Idle;

        uint approvedCount = 0;
        for (uint i = 0; i < guardians.length; i++) {
            if (approvedGuardians[guardians[i]]) {
                approvedCount++;
            }
        }

        if (approvedCount == guardians.length && guardians.length > 0) { // Alla guardians måste godkänt
            return PaymentStatus.Approved;
        }


        return PaymentStatus.Pending;
    }

    function handleDirectTransfer() external {
        // Avsändaren skickar pengar in i kontraktet
        // Fallback??
    }
}
