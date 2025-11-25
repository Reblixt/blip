// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {console} from "forge-std/console.sol";

// forge script script/ApproveTokens.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

contract ApproveTokens is Script {
    function run() external {
        uint256 aliceKey = vm.envUint("ALICE_KEY");
        address tokenAddress = vm.envAddress("MOCK_TOKEN_ADDRESS");
        address blipAddress = vm.envAddress("BLIP_CONTRACT_ADDRESS");
        
        uint256 approveAmount = 500 * 10**6;
        
        vm.startBroadcast(aliceKey);
        
        MockERC20 token = MockERC20(tokenAddress);
        
        console.log("=================================");
        console.log("Approving tokens...");
        console.log("Alice approves Blip to spend:", approveAmount / 10**6, "mUSDC");
        
        token.approve(blipAddress, approveAmount);
        
        uint256 allowance = token.allowance(msg.sender, blipAddress);
        console.log("Current allowance:", allowance / 10**6, "mUSDC");
        console.log("=================================");
        
        vm.stopBroadcast();
    }
}