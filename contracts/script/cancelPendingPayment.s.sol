// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CancelPaymentScript is Script {
    //NOTE:
    //forge script script/cancelPendingPayment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    address constant CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    uint256 constant RECIPIENT_ALICE_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    uint256 paymentId = 0;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(RECIPIENT_ALICE_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.cancelPendingPayment(paymentId);
        console.log("Owner/sender", msg.sender);
        console.log("contract address", CONTRACT_ADDRESS);

        vm.stopBroadcast();
    }
}
