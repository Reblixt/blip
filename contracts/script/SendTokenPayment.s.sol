// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {console} from "forge-std/console.sol";

// forge script script/SendTokenPayment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

contract SendTokenPayment is Script {
    function run() external {
        uint256 aliceKey = vm.envUint("ALICE_KEY");
        address blipAddress = vm.envAddress("BLIP_CONTRACT_ADDRESS");
        address tokenAddress = vm.envAddress("MOCK_TOKEN_ADDRESS");
        address bobAddress = vm.envAddress("BOB_ADDRESS");
        address aliceAddress = vm.envAddress("ALICE_ADDRESS");
        
        uint256 paymentAmount = 100 * 10**6;
        
        MockERC20 token = MockERC20(tokenAddress);
        Blip blip = Blip(payable(blipAddress));
        
        console.log("=================================");
        console.log("Before payment:");
        console.log("Alice balance:", token.balanceOf(aliceAddress) / 10**6, "mUSDC");
        console.log("Bob balance:", token.balanceOf(bobAddress) / 10**6, "mUSDC");
        console.log("Blip contract balance:", token.balanceOf(blipAddress) / 10**6, "mUSDC");
        console.log("=================================");
        
        vm.startBroadcast(aliceKey);
        
        console.log("\nSending payment...");
        console.log("Amount:", paymentAmount / 10**6, "mUSDC");
        console.log("From:", aliceAddress);
        console.log("To:", bobAddress);
        
        blip.initPayment(tokenAddress, bobAddress, paymentAmount, "Token test payment!");
        
        vm.stopBroadcast();
        
        console.log("\n=================================");
        console.log("After payment:");
        console.log("Alice balance:", token.balanceOf(aliceAddress) / 10**6, "mUSDC");
        console.log("Bob balance:", token.balanceOf(bobAddress) / 10**6, "mUSDC");
        console.log("Blip contract balance:", token.balanceOf(blipAddress) / 10**6, "mUSDC");
        console.log("=================================");
    }
}