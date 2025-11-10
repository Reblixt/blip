// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CounterScript is Script {
    //NOTE:
    //forge script script/Blip.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    uint256 PRIVATE_KEY = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(PRIVATE_KEY);

        blip = Blip(payable(address(0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9)));
        blip.leaveGuardianRole();
        console.log("Owner/sender", msg.sender);
        console.log("contract address", address(blip));

        vm.stopBroadcast();
    }
}
