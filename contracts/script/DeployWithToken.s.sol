// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {console} from "forge-std/console.sol";

contract DeployWithToken is Script {
    // Anvil default accounts
    uint256 constant DEPLOYER_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    address constant ALICE = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant BOB = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address constant CHARLIE = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Guardian

    function run() external {
        vm.startBroadcast(DEPLOYER_KEY);

        Blip blip = new Blip();
        console.log("=================================");
        console.log("Blip deployed at:", address(blip));

        MockERC20 token = new MockERC20("Mock USDC", "mUSDC", 6);
        console.log("MockERC20 deployed at:", address(token));
        console.log("=================================");

        console.log("\nMinting tokens...");
        
        token.mint(ALICE, 1000 * 10**6); 
        console.log("Alice balance:", token.balanceOf(ALICE) / 10**6, "mUSDC");
        
        token.mint(BOB, 500 * 10**6); 
        console.log("Bob balance:", token.balanceOf(BOB) / 10**6, "mUSDC");
        
        token.mint(CHARLIE, 500 * 10**6);
        console.log("Charlie balance:", token.balanceOf(CHARLIE) / 10**6, "mUSDC");

        console.log("=================================");
        console.log("\nDeployment complete!");
        console.log("\nCopy these to your .env files:");
        console.log("BLIP_CONTRACT=", address(blip));
        console.log("MOCK_TOKEN=", address(token));

        vm.stopBroadcast();
    }
}