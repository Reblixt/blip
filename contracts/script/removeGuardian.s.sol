// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CounterScript is Script {
    //NOTE:
    //forge script script/Blip.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    uint256 PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    address guardianToRemove = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(PRIVATE_KEY);

        blip = Blip(payable(address(0x5FbDB2315678afecb367f032d93F642f64180aa3)));
        blip.removeGuardian(guardianToRemove);
        console.log("Owner/sender", msg.sender);
        console.log("contract address", address(blip));

        vm.stopBroadcast();
    }
}
