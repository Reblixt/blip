// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";
import {MockERC20} from "../src/MockERC20.sol";

contract CounterScript is Script {
    //NOTE:
    //forge script script/Blip.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    address constant ALICE = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant BOB = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address constant CHARLIE = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; 
    address usdc;

    Blip public blip;

    function setUp() public {}


    function networkConfig() public {
        if (block.chainId == 31337) { 
            MockERC20 token = new MockERC20("Mock USDC", "mUSDC", 6);
             token.mint(ALICE, 1000 * 10**6); 
             token.mint(BOB, 1000 * 10**6);
             token.mint(CHARLIE, 1000 * 10**6);
            usdc = address(token);
        } else if (block.chainId == 11155111) { 
            usdc = address(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238);
        } else if (block.chainId == 80002) { 
            usdc = address(0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582);
        } else if (block.chainId == 1) { 
            usdc = address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);   
        } else if (block.chainId == 137) { 
            usdc = address(0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359);
        } else {
            revert("Unsupported network");
        }
    }

    function deployerKey() private view returns (uint256) {
        if (block.chainId == 31337) {
            return vm.envUint("ANVIL_PRIVATE_KEY");
        } else if (block.chainId == 11155111) {
            return vm.envUint("SEPOLIA_PRIVATE_KEY");
        } else if (block.chainId == 137) {
            return vm.envUint("POLYGON_PRIVATE_KEY");
        } else {
            revert("Unsupported network");
        }
    }

    function run() public {
        networkConfig();
        vm.startBroadcast(deployerKey());

        blip = new Blip();

        console.log("Owner/sender",  msg.sender);
        console.log("contract address", address(blip));

        vm.stopBroadcast();
    }


}
