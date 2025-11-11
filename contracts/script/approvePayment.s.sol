// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract ApprovePaymentScript is Script {
    //NOTE:
    //forge script script/approvePayment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    address constant CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    uint256 GUARDIAN_BOB_PRIVATE_KEY = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;

    uint256 paymentId = 0;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(GUARDIAN_BOB_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.approvePayment(paymentId);
        console.log("Owner/sender", msg.sender);
        console.log("contract address", CONTRACT_ADDRESS);

        vm.stopBroadcast();
    }
}
