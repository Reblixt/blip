// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {IERC20} from "forge-std/interfaces/IERC20.sol";

// Swish alternative
contract Blip {
    constructor() {
        paymentStatus = PaymentStatus.Idle;
        recipientAddress = msg.sender;
    }

    error NoGuardian();

    enum PaymentStatus {
        Idle,
        Pending,
        Approved,
        Rejected
    }
    PaymentStatus public paymentStatus;

    struct Payment {
        uint256 id;
        address sender;
        PaymentStatus status;
        uint amount;
        mapping(address => bool) approvedBy;
    }

    address public recipientAddress;
    address public senderAddress;
    uint public amount;
    uint256 public paymentId;
    IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48); // USDC contract on Ethereum mainnet

    address[] public guardians;
    mapping(uint id => Payment) public payments;
    mapping(address => bool) public guardiansMap;

    // mapping(address => bool) approvedGuardians;

    //Init

    function initPayment() external payable {
        // Minst en guardian behöver vara satt
        require(guardians.length > 0, "No guardians set");
        // Inga uppdateringar under aktiv betalning
        require(paymentStatus == PaymentStatus.Idle, "Payment already active");
        // 0 är inte giltigt belopp
        require(msg.value > 0, "0 is not a valid payment amount");

        for (uint i = 0; i < guardians.length; i++) {
            approvedGuardians[guardians[i]] = false; // Börja med ej godkänt
        }

        senderAddress = msg.sender;
        amount = msg.value;
        paymentStatus = PaymentStatus.Pending;
    }

    // function setRecipient() external {
    //     // Mottagaren kan bara göra detta en gång
    //     require(recipientAddress == address(0), "Recipient wallet already set");
    //     // Sätt mottagaren
    //     recipientAddress = msg.sender;
    //     // event-logga att mottagaren har uppdaterats
    // }

    function addGuardian(address newGuardian) external {
        // Endast mottagaren kan ändra
        require(
            msg.sender == recipientAddress,
            "Only the recipient can add guardians"
        );
        // Redan guardian
        require(!guardiansMap[newGuardian], "Guardian already in list");
        // Inga uppdateringar under aktiv betalning (escrow måste vara stilla)
        require(
            paymentStatus != PaymentStatus.Pending,
            "Cannot change guardians during payment"
        );
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
        require(
            msg.sender == recipientAddress,
            "Only the recipient can add guardians"
        );
        // Redan guardian
        require(guardiansMap[oldGuardian], "Guardian not in list");
        // Inga uppdateringar under aktiv betalning (escrow måste vara stilla)
        require(
            paymentStatus != PaymentStatus.Pending,
            "Cannot change guardians during payment"
        );
        // Ta bort från mapping
        guardiansMap[oldGuardian] = false;
        // Ta bort från approval
        approvedGuardians[oldGuardian] = false;
        // Remove from array
        removeFromArray(oldGuardian);

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

    function refundPayment() public {
        // Kontrollera att betalningen faktiskt är Pending eller Rejected
        require(
            paymentStatus == PaymentStatus.Pending ||
                paymentStatus == PaymentStatus.Rejected,
            "Payment is not pending or rejected"
        );

        // Skicka pengarna tillbaka till avsändaren
        payable(senderAddress).transfer(amount);

        // Nollställ inför nästa betalning
        amount = 0;
        senderAddress = address(0);

        // Uppdatera betalningsstatus
        paymentStatus = PaymentStatus.Idle;

        // Event-logga att betalningen har skickats tillbaka
    }

    function releasePayment() public {
        // Kontrollera att betalningen är Approved
        require(
            paymentStatus == PaymentStatus.Approved,
            "Payment is not approved"
        );

        // Har kontraktet tillräckligt med pengar?
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );

        // Skicka pengarna till mottagaren
        payable(recipientAddress).transfer(amount);

        // Nollställ inför nästa betalning
        amount = 0;
        senderAddress = address(0);

        // Uppdatera betalningsstatus
        paymentStatus = PaymentStatus.Idle;

        // Event-logga att betalningen har släppts
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

        // Lägg till guardian i listan över godkända guardians
        // Bör vara mapping
        approvedGuardians[msg.sender] = true;

        // Event-logga att personen har godkännt

        // Om tillräckligt många har godkänt
        if (getSignerStatus() == PaymentStatus.Approved) {
            // Sätt betalningsstatus till approved
            paymentStatus = PaymentStatus.Approved;
            // Skicka ut pengarna
            releasePayment();
        }

        // Event-logga att betalningen har godkännts
    }

    function rejectPayment() external {
        // Kontrollera att personen som anropar är en guardian
        require(guardiansMap[msg.sender], "Signer is not a valid guardian");

        // Kontrollera att betalningen är Pending
        require(
            paymentStatus == PaymentStatus.Pending,
            "Payment is not pending"
        );

        // Sätt betalningsstatus till rejected
        paymentStatus = PaymentStatus.Rejected;

        // Skicka tillbaka pengarna till avsändaren
        refundPayment();

        // Event-logga att betalningen har avvisats
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

    function handleDirectTransfer() external {
        // Om avsändaren skickar pengar in i kontraktet...
        // Fallback??
    }
}
