// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

//forge script script/acceptGuardian.s.sol --rpc-url http://localhost:8545 --broadcast

contract AcceptGuardianScript is Script {
    address constant CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    address constant RECIPIENT_ADDRESS = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 constant GUARDIAN_BOB_PRIVATE_KEY = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;

    Blip public blip;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(GUARDIAN_BOB_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.acceptGuardianRole(RECIPIENT_ADDRESS);

        console.log("Guardian accepts guardian role");
        console.log("Guardian address", msg.sender);
        console.log("Recipient address", RECIPIENT_ADDRESS);
        console.log("contract address", CONTRACT_ADDRESS);

        vm.stopBroadcast();
    }
}