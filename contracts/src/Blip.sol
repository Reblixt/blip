// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

// Swish alternative
contract Blip {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function send() external {
        // mata in token adress, wallet address
        //
    }

    function recieve() external {
        //
    }

    function approve() external {
        //
    }
}
