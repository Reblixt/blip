// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract AcceptGuardianScript is Script {
    //NOTE:
    //forge script script/acceptGuardian.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    address constant CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    uint256 constant GUARDIAN_BOB_PRIVATE_KEY = 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(GUARDIAN_BOB_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.acceptGuardianRole();

        console.log("Guardian accepts guardian role");
        console.log("Guardian address", msg.sender);
        console.log("contract address", CONTRACT_ADDRESS);

        vm.stopBroadcast();
    }
}
