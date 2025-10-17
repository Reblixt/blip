// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract BlipTest is Test {
    Blip public kontrakt;

    address public Alice = vm.addr(129);

    function setUp() public {
        kontrakt = new Blip(address(this));
        vm.deal(Alice, 1 ether);
    }

    function test_recipientIsSetCorrectly() public view {
        address recipient = kontrakt.recipientAddress();
        assertEq(recipient, address(this));
    }

    function test_proposeGuardian() public {
        kontrakt.proposeGuardian(Alice); 
        bool isPending = kontrakt.pendingGuardians(Alice);
        assertEq(isPending, true);
    }

    function test_cannotProposeZeroAddress() public {
        vm.expectRevert(Blip.InvalidAddress.selector);
        kontrakt.proposeGuardian(address(0));
    }

    function test_recipientCannotBeGuardian() public {
        vm.expectRevert(Blip.RecipientCannotBeGuardian.selector);
        kontrakt.proposeGuardian(address(this));
    }

    function test_acceptGuardianRole() public {
        // 1. Recipient föreslår Alice
        kontrakt.proposeGuardian(Alice);
        // 2. Alice accepterar (använd vm.prank!)
        vm.prank(Alice);
        kontrakt.acceptGuardianRole();
        // 3. Verifiera att Alice är aktiv guardian
        assertEq(kontrakt.pendingGuardians(Alice), false);
        assertEq(kontrakt.guardiansMap(Alice), true);
    }

    // function test_initPayment() public {

    //     uint balance = Alice.balance;
    //     assertEq (balance, 1 ether);

    //     kontrakt.addGuardian(address(0x0000000000000000000000000000000000000000));

    //     vm.prank(Alice);

    //     kontrakt.initPayment{
    //         value: 1 * 10**18
    //     }();

    //     uint newBalance = Alice.balance;
    //     assertEq (newBalance, 0);
    // }

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
