// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {console} from "forge-std/console.sol";

contract DeployMockUSDC is Script {
    function run() external {
        address deployer = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        
        vm.startBroadcast();

        MockUSDC usdc = new MockUSDC();

        usdc.mint(deployer, 1000000000000);

        vm.stopBroadcast();

        console.log("MockUSDC deployed at:", address(usdc));
    }
}
