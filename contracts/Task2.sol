// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

enum MemberType {
    FREE,
    PREMIUM,
    ENTERPRISE
}

struct Member {
    uint id;
    string name;
    uint256 balance;
    MemberType memberType;
}

contract Task2 {
    mapping(address => Member) private members;

    // assign default value to avoid id 0
    uint private idCounter;

    // debug
    Member[] private memberList;

    function addMember(
        address _memberAddress,
        string memory _name,
        MemberType _memberType
    ) external {
        members[_memberAddress] = Member({
            id: ++idCounter,
            name: _name,
            balance: 0,
            memberType: _memberType
        });

        // debug push to array
        memberList.push(members[_memberAddress]);
    }

    function removeMember(address _memberAddress) external {
        delete members[_memberAddress];

        // debug
        for (uint i = 0; i < memberList.length; i++) {
            if (memberList[i].id == members[_memberAddress].id) {
                memberList[i] = memberList[memberList.length - 1];
                memberList.pop();
                break;
            }
        }
    }

    function updateMember(
        address _memberAddress,
        string memory _name,
        uint _balance,
        MemberType _memberType
    ) external {
        // default value for id is 0
        // and if the address is not in member, id will be 0
        if (members[_memberAddress].id == 0) {
            revert("Member not found");
        }

        members[_memberAddress].name = _name;
        members[_memberAddress].memberType = _memberType;
        members[_memberAddress].balance = _balance;
    }

    function isMember(address _member) external view returns (bool) {
        // require(!members[_member], "Member not found");
        // if (!members[_member]) {
        //     revert("Member not found");
        // }

        return members[_member].id != 0;
    }

    function getMember(
        address _memberAddress
    ) external view returns (Member memory) {
        if (members[_memberAddress].id == 0) {
            revert("Member not found");
        }

        return members[_memberAddress];
    }

    // debug
    function getAllMembers() external view returns (Member[] memory) {
        return memberList;
    }
}
