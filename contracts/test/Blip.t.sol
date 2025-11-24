// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Blip} from "../src/Blip.sol";
import {console} from "forge-std/console.sol";

contract BlipTest is Test {
    Blip public kontrakt;

    address public Alice = vm.addr(129);
    address public Bill = vm.addr(130);

    // Deklarera event
    event GuardianAdded(
        address indexed recipientAddress,
        address indexed guardianAddress
    );
    event GuardianDeclinedRole(
        address indexed recipient,
        address indexed guardian
    );
    event PaymentInitiated(
    uint256 indexed paymentId, 
    address indexed senderAddress, 
    address indexed recipient,
    uint amount, 
    address tokenAddress,
    string message
);

    function setUp() public {
        kontrakt = new Blip();
        vm.deal(Alice, 1 ether);
        vm.deal(Bill, 2 ether);
        vm.deal(address(kontrakt), 1 ether);
    }

    function test_proposeGuardian() public {
    kontrakt.proposeGuardian(Alice);
    bool isPending = kontrakt.pendingGuardians(address(this), Alice);
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
    kontrakt.proposeGuardian(Alice);
    
    vm.expectEmit(true, true, true, true);
    emit GuardianAdded(address(this), Alice);
    
    vm.prank(Alice);
    kontrakt.acceptGuardianRole(address(this)); 
    
    assertEq(kontrakt.pendingGuardians(address(this), Alice), false);
    assertEq(kontrakt.isGuardian(address(this), Alice), true); 
}

    function test_declineGuardianRole() public {
    kontrakt.proposeGuardian(Alice);
    
    vm.expectEmit(true, true, true, true);
    emit GuardianDeclinedRole(address(this), Alice);
    
    vm.prank(Alice);
    kontrakt.declineGuardianRole(address(this)); 
    
    assertEq(kontrakt.pendingGuardians(address(this), Alice), false); 
    assertEq(kontrakt.isGuardian(address(this), Alice), false);
    }

    function test_initPayment() public {
    _setUpGuardians(); 
    
    vm.deal(address(this), 2 ether);
    
    vm.expectEmit(true, true, true, true);
    emit PaymentInitiated(
        0,                
        address(this),     
        Bill,               
        1 ether,           
        address(0),        
        "Test message"  
    );

    kontrakt.initPayment{value: 1 ether}(Bill, 1 ether, "Test message");
    
    assertEq(kontrakt.paymentCounter(), 1);
    assertEq(address(this).balance, 1 ether); 
    assertEq(address(kontrakt).balance, 2 ether);
    }

    function test_ApprovePaymentsWithGuardians() public {
    _setUpGuardians();
    
    vm.deal(address(this), 2 ether);

    kontrakt.initPayment{value: 1 ether}(Bill, 1 ether, "Test message");

    console.log(address(kontrakt).balance);

    vm.prank(Alice);
    kontrakt.approvePayment(0);
    }

    function _setUpGuardians() internal {
    kontrakt.proposeGuardian(Alice);
    vm.prank(Alice);
    kontrakt.acceptGuardianRole(address(this)); 
    }
}
