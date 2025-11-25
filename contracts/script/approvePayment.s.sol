// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {console} from "forge-std/console.sol";

// forge script script/approvePayment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

contract ApprovePaymentScript is Script {
    function run() public {
        uint256 bobKey = vm.envUint("BOB_KEY");
        address blipAddress = vm.envAddress("BLIP_CONTRACT_ADDRESS");
        address tokenAddress = vm.envAddress("MOCK_TOKEN_ADDRESS");
        address bobAddress = vm.envAddress("BOB_ADDRESS");
        
        Blip blip = Blip(payable(blipAddress));
        MockERC20 token = MockERC20(tokenAddress);
        
        uint256 paymentId = 3;
        
        console.log("=================================");
        console.log("Before approval:");
        console.log("Bob balance:", token.balanceOf(bobAddress) / 10**6, "mUSDC");
        console.log("Blip contract balance:", token.balanceOf(blipAddress) / 10**6, "mUSDC");
        console.log("=================================");
        
        vm.startBroadcast(bobKey);
        
        console.log("\nBob (guardian) approving payment #", paymentId);
        blip.approvePayment(paymentId);
        
        vm.stopBroadcast();
        
        console.log("\n=================================");
        console.log("After approval:");
        console.log("Bob balance:", token.balanceOf(bobAddress) / 10**6, "mUSDC");
        console.log("Blip contract balance:", token.balanceOf(blipAddress) / 10**6, "mUSDC");
        console.log("=================================");
        console.log("\nPayment released to Bob!");
    }
}