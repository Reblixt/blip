// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CounterScript is Script {
//NOTE: 
  //forge script script/Blip.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --interactives 1

    Blip public blip;

    address public owner;

    function setUp() public {
    }

    function run() public {


        vm.startBroadcast();

        blip = new Blip();

        blip.initPayment();

        console.log("Owner/sender", msg.sender);
        console.log("contract address", address(blip));
        
        vm.stopBroadcast();
    }


}
