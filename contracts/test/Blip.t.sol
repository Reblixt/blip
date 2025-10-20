// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract BlipTest is Test {
    Blip public kontrakt;

    address public Alice = vm.addr(129);
    address public Bill = vm.addr(130);  // <- Lägg till denna

    // Deklarera event
    event GuardianAdded(address indexed recipientAddress, address indexed guardianAddress);
    event GuardianDeclinedRole(address indexed recipient, address indexed guardian);
    event PaymentInitiated(address senderAddress, uint amount);

    function setUp() public {
        kontrakt = new Blip();
        vm.deal(Alice, 1 ether);
        vm.deal(Bill, 2 ether);
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

        // 2. Förvänta event
        vm.expectEmit(true, true, true, true);
        emit GuardianAdded(address(this), Alice);  // Fyll i rätt värden här

        // 3. Alice accepterar (använd vm.prank!)
        vm.prank(Alice);
        kontrakt.acceptGuardianRole();
        
        // 4. Verifiera att Alice är aktiv guardian
        assertEq(kontrakt.pendingGuardians(Alice), false);
        assertEq(kontrakt.guardiansMap(Alice), true);
    }

    function test_declineGuardianRole() public {
        // 1. Recipient föreslår Alice
        kontrakt.proposeGuardian(Alice);

        vm.prank(Alice);

        // 2. Förvänta event
        vm.expectEmit(true, true, true, true);
        emit GuardianDeclinedRole(address(this), Alice);  // Fyll i rätt värden här

        kontrakt.declineGuardianRole();

        assertEq(kontrakt.pendingGuardians(Alice), false);
        assertEq(kontrakt.guardiansMap(Alice), false);

    }

    function test_initPayment() public {
        // 1. Sätt upp Alice som guardian
        //    (föreslå + acceptera)
        kontrakt.proposeGuardian(Alice);
        vm.prank(Alice);
        kontrakt.acceptGuardianRole();

        //    - Event emitterades
        vm.expectEmit(true, true, true, true);
        emit PaymentInitiated(Bill, 1 ether);  // Fyll i rätt värden här
        
        // 2. Bill skickar betalning
        vm.prank(Bill);
        kontrakt.initPayment{value: 1 ether}("Test message");
        
        // 3. Verifiera:
        //    - paymentCounter ökade
        assertEq(kontrakt.paymentCounter(), 1);
        //    - Bills balance minskade
        assertEq(Bill.balance, 1 ether);
        //    - Kontraktets balance ökade
        assertEq(address(kontrakt).balance, 1 ether);
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
