// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

// Swish alternative
contract Blip {

    // En lagrad variabel som kontraktet kommer ihåg
    address public recipientAddress;
    address public senderAddress;
    address[] public guardians;
    uint public amount;

    //Init

    function initPayment() external payable {
        require(senderAddress == address(0), "Payment already initialized");
        require(msg.value > 0, "0 is not a valid payment amount");

        senderAddress = msg.sender;
        amount = msg.value;
    }

    function setRecipient() external {
        // Mottagaren kan bara göra detta en gång
        require(recipientAddress == address(0), "Recipient wallet already set");
        // Sätt mottagaren
        recipientAddress = msg.sender;
        // event-logga att mottagaren har uppdaterats
    }
    

    function setGuardians (address[] memory newGuardians) external {
        // Mottagaren kan ange vilka adresser som får godkänna betalningar:
        // Bra mottagaren kan sätta listan
        require(msg.sender == recipientAddress, "Only the recipient can set the guardians");
        // Minst en signer ska vara i listan
        require(newGuardians.length > 0, "Guardians list cannot be empty");
        // Sätt listan
        guardians = newGuardians;
       // event-logga att mottagaren har uppdaterat listan
    }

    function updateGuardians() external {
        // Mottagaren kan uppdatera listan med nya signers
    }

    // Transaktioner

    function sendPayment() external {
       // Avsändaren skickar pengar in i kontraktet
        // Pengarna hålls tills signers godkänner betalningen
    }

    function refundPayment() external {
        // Returnerar pengar till avsändaren
        // Kan ske om signers avvisar eller timeout inträffar
    }

    function releasePayment() external {
             // Släpper pengarna till mottagarens smart wallet
        // Endast om tillräckligt många signers har godkänt   
    }

    // Signers

    function approvePayment() external {
        // En signer godkänner betalningen
    }

    function rejectPayment() external {
         // En signer avvisar betalningen
    }

    function getSignerStatus() external {
        // Returnerar om tillräckligt många signers har godkänt
        // Kan returnera status: pending, approved, rejected
    }

    // Säkerhet
    function isValidSigner() external {
        // Kontrollera att den som signerar är en definierad guardian
    }

    function getPaymentStatus() external {
        // Returnerar status: pending, approved, rejected
    }

    function handleDirectTransfer() external {
        // Avsändaren skickar pengar in i kontraktet
        // Fallback??
    }
}
