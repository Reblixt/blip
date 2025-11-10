// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CounterScript is Script {
    //NOTE:
    //forge script script/Blip.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    uint256 PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 paymentId = 2;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(PRIVATE_KEY);

        blip = Blip(payable(address(0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9)));
        blip.cancelPendingPayment(paymentId);
        console.log("Owner/sender", msg.sender);
        console.log("contract address", address(blip));

        vm.stopBroadcast();
    }
}
