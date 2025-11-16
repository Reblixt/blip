// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract NewGuardianScript is Script {
    //NOTE:
    //forge script script/newGuardian.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

    uint256 constant RECIPIENT_ALICE_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    address constant CONTRACT_ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    address constant GUARDIAN_BOB = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;

    Blip public blip;

    address public owner;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(RECIPIENT_ALICE_PRIVATE_KEY);

        blip = Blip(payable(CONTRACT_ADDRESS));
        blip.proposeGuardian(GUARDIAN_BOB);
        console.log("Guardian address", GUARDIAN_BOB);
        console.log("contract address", CONTRACT_ADDRESS);

        vm.stopBroadcast();
    }
}
