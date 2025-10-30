// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";

contract CounterScript is Script {
    Blip public blip;

    address public owner;

    function setUp() public {

    }

    function run() public {
        vm.startBroadcast();

        blip = new Blip();

        vm.stopBroadcast();
    }
}
