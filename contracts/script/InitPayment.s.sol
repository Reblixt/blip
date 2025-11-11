// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract InitPaymentScript is Script {
    // NOTE:
    // forge script script/InitPayment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    address constant CONTRACT_ADDRESS = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;

    uint256 constant SENDER_CHARLIE_PRIVATE_KEY = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;

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