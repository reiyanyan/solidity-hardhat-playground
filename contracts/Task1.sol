// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Task1 {
    mapping(address => bool) private members;

    // debug
    address[] private memberList;

    function addMember(address _member) external {
        members[_member] = true;

        // debug push to array
        memberList.push(_member);
    }

    function removeMember(address _member) external {
        delete members[_member];

        // debug
        for (uint i = 0; i < memberList.length; i++) {
            if (memberList[i] == _member) {
                memberList[i] = memberList[memberList.length - 1];
                memberList.pop();
                break;
            }
        }
    }

    function isMember(address _member) external view returns (bool) {
        // require(!members[_member], "Member not found");
        // if (!members[_member]) {
        //     revert("Member not found");
        // }

        return members[_member];
    }

    // debug
    function getAllMembers() external view returns (address[] memory) {
        return memberList;
    }
}
