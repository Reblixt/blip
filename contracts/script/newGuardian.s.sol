// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract NewGuardianScript is Script {
    //NOTE:
    //forge script script/newGuardian.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    uint256 constant RECIPIENT_ALICE_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    address constant CONTRACT_ADDRESS = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;

    address constant GUARDIAN_BOB = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(RECIPIENT_ALICE_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.proposeGuardian(GUARDIAN_BOB);
        console.log("Guardian address", GUARDIAN_BOB);
        console.log("contract address", CONTRACT_ADDRESS);

        vm.stopBroadcast();
    }
}
