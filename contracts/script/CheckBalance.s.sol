// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {console} from "forge-std/console.sol";

//forge script script/CheckBalance.s.sol --rpc-url http://127.0.0.1:8545

contract CheckBalance is Script {
    function run() external view {
        address tokenAddress = vm.envAddress("MOCK_TOKEN_ADDRESS");
        address aliceAddress = vm.envAddress("ALICE_ADDRESS");
        address bobAddress = vm.envAddress("BOB_ADDRESS");
        
        MockERC20 token = MockERC20(tokenAddress);
        
        uint256 aliceBalance = token.balanceOf(aliceAddress);
        uint256 bobBalance = token.balanceOf(bobAddress);
        
        console.log("=================================");
        console.log("Token balances:");
        console.log("=================================");
        console.log("Alice (raw):", aliceBalance);
        console.log("Alice (mUSDC):", aliceBalance / 10**6);
        console.log("");
        console.log("Bob (raw):", bobBalance);
        console.log("Bob (mUSDC):", bobBalance / 10**6);
        console.log("=================================");
    }
}