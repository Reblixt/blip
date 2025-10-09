// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract CounterTest is Test {
    Blip public counter;

    address public Alice = vm.addr(129);

    function setUp() public {
        counter = new Blip();
    }

    // function test_Increment() public {
    //     address sender = msg.sender;
    //     console.log("signer", sender);
    //     vm.startPrank(Alice);
    //     console.log("signer", msg.sender);
    //     counter.increment();
    //     vm.stopPrank();
    //     assertEq(counter.number(), 1);
    // }
    //
    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     counter.increment();
    //     assertEq(counter.number(), x);
    // }
}
