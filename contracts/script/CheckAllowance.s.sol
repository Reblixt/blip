// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {console} from "forge-std/console.sol";

contract CheckAllowance is Script {
    function run() external view {
        address tokenAddress = vm.envAddress("MOCK_TOKEN_ADDRESS");
        address blipAddress = vm.envAddress("BLIP_CONTRACT_ADDRESS");
        address aliceAddress = vm.envAddress("ALICE_ADDRESS");
        
        MockERC20 token = MockERC20(tokenAddress);
        
        uint256 allowance = token.allowance(aliceAddress, blipAddress);
        
        console.log("=================================");
        console.log("Allowance check:");
        console.log("=================================");
        console.log("Alice has approved Blip to spend:");
        console.log("Raw:", allowance);
        console.log("mUSDC:", allowance / 10**6);
        console.log("=================================");
    }
}