// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

//forge script script/acceptGuardian.s.sol --rpc-url http://localhost:8545 --broadcast

contract AcceptGuardianScript is Script {
    function run() public {
        uint256 bobKey = vm.envUint("BOB_KEY");
        address blipAddress = vm.envAddress("BLIP_CONTRACT_ADDRESS");
        address aliceAddress = vm.envAddress("ALICE_ADDRESS");

        vm.startBroadcast(bobKey);

        Blip blip = Blip(payable(blipAddress));
        blip.acceptGuardianRole(aliceAddress);

        console.log("Guardian accepts guardian role");
        console.log("Guardian address:", msg.sender);
        console.log("Recipient address:", aliceAddress);
        console.log("Contract address:", blipAddress);

        vm.stopBroadcast();
    }
}