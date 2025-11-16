// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract InitPaymentScript is Script {
    // NOTE:
    // forge script script/InitPayment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    address constant CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    uint256 constant SENDER_CHARLIE_PRIVATE_KEY = 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6;

    Blip public blip;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(SENDER_CHARLIE_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.initPayment{value: 1 ether}("Test message from sender");
        
        console.log("Contract address:", CONTRACT_ADDRESS);
        console.log("Sender initiates payment");
        console.log("Sender address:", msg.sender);
        console.log("Amount: 1 ETH");

        vm.stopBroadcast();
    }
}