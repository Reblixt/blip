// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract BlipTest is Test {
    Blip public kontrakt;

    address public Alice = vm.addr(129);

    function setUp() public {
        kontrakt = new Blip();
        vm.deal(Alice, 1 ether);
    }

    function test_initPayment() public {

        uint balance = Alice.balance;
        assertEq (balance, 1 ether);

        kontrakt.addGuardian(address(0x0000000000000000000000000000000000000000));

        vm.prank(Alice);

        kontrakt.initPayment{
            value: 1 * 10**18
        }();

        uint newBalance = Alice.balance;
        assertEq (newBalance, 0);
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
