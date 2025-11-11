// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CounterScript is Script {
    //NOTE:
    //forge script script/Blip.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    uint256 PRIVATE_KEY = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(PRIVATE_KEY);

        blip = Blip(payable(address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0)));
        blip.declineGuardianRole();
        console.log("Owner/sender", msg.sender);
        console.log("contract address", address(blip));

        vm.stopBroadcast();
    }
}
