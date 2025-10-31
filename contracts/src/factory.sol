// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Blip} from "./Blip.sol";

contract BlipFactory {
    event newBlip(address indexed owner, address indexed blip);

    function deployNewBlip() public {
        Blip blip = new Blip();

        emit newBlip(msg.sender, address(blip));
    }
}
