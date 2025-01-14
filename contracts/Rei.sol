// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

import "hardhat/console.sol";

/* -------------------------------------------------------------------------- */
/*                                data location                               */
/*                         memory vs calldata (params)                        */
/*           memory can modified params (append something to params)          */
/*          calldata cannot be modified, it is read-only, only return         */
/* -------------------------------------------------------------------------- */

contract Rei {
    string public whoami;

    function printme() external view returns (string memory) {
        console.log("I am %o", whoami);
        return whoami;
    }

    function changemeModified(string memory _rei) public {
        _rei = string.concat("I am ", _rei);
        whoami = _rei;
    }

    function changemeNoModified(string calldata _rei) public {
        // solidity(7407): Type string memory is not implicitly convertible to expected type string calldata
        // _rei = string.concat("I am ", _rei);
        whoami = _rei;
    }
}
