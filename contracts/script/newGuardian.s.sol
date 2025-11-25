// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

//forge script script/newGuardian.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

contract NewGuardianScript is Script {
    function run() public {
        uint256 aliceKey = vm.envUint("ALICE_KEY");
        address blipAddress = vm.envAddress("BLIP_CONTRACT_ADDRESS");
        address bobAddress = vm.envAddress("BOB_ADDRESS");

        vm.startBroadcast(aliceKey);

        Blip blip = Blip(payable(blipAddress));
        blip.proposeGuardian(bobAddress);
        
        console.log("Guardian address:", bobAddress);
        console.log("Contract address:", blipAddress);

        vm.stopBroadcast();
    }
}