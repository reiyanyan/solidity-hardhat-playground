// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

struct Item {
    uint id;
    string name;
    uint price;
    address payable seller;
    bool isSold;
}

contract Marketplace {
    /* ------------------------------ error section ----------------------------- */
    error NoFundsToWithdraw(address seller);
    error PriceMustBeGreaterThanZero(string name, uint price);
    error IncorrectSentValue(uint msgValue, uint price);
    error ItemSold(Item item);
    error ItemNotFound(uint itemId);
    error OwnedNothing(address owner);

    /* ------------------------------ event section ----------------------------- */
    event Listed(uint id, string name, uint price, address seller);
    event Purchased(uint id, address buyer);
    event Withdraw(address seller, uint amount);

    /* ---------------------------- variables section --------------------------- */
    mapping(uint => Item) public items;
    mapping(address => uint[]) public ownerItems;
    mapping(address => uint) private sellerBalances;
    uint private itemCounter;

    constructor() {
        // i don't want zero to be first ID of candidate
        itemCounter = 1;
    }

    function isValidItem(uint _itemId) internal view returns (bool) {
        if (bytes(items[_itemId].name).length == 0) {
            revert ItemNotFound(_itemId);
        }

        return true;
    }

    /* ------------------------------- add to list ------------------------------ */
    function listItem(string memory _name, uint _price) external {
        if (_price == 0) {
            revert PriceMustBeGreaterThanZero(_name, _price);
        }

        items[itemCounter] = Item({
            id: itemCounter,
            name: _name,
            price: _price,
            seller: payable(msg.sender),
            isSold: false
        });

        itemCounter++;

        emit Listed(itemCounter, _name, _price, msg.sender);
    }

    /* -------------------------------- purchase -------------------------------- */
    function purchaseItem(uint _itemId) external payable {
        Item storage item = items[_itemId];

        if (item.isSold) {
            revert ItemSold(item);
        }

        if (msg.value != item.price) {
            revert IncorrectSentValue(msg.value, item.price);
        }

        isValidItem(_itemId);

        item.isSold = true;
        ownerItems[msg.sender].push(_itemId);
        sellerBalances[item.seller] += msg.value;

        emit Purchased(_itemId, msg.sender);
    }

    /* -------------------------------- withdraw -------------------------------- */
    function withdrawFunds() public returns (bool) {
        uint amount = sellerBalances[msg.sender];

        if (amount == 0) {
            revert NoFundsToWithdraw(msg.sender);
        }

        sellerBalances[msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");

        emit Withdraw(msg.sender, amount);

        return sent;
    }

    /* -------------------------------- get owned ------------------------------- */
    function getOwnedItems(
        address _owner
    ) external view returns (uint[] memory) {
        if (ownerItems[_owner].length > 0) {
            return ownerItems[_owner];
        } else {
            revert OwnedNothing(_owner);
        }
    }
}
