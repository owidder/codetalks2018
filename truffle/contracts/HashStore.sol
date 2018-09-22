pragma solidity ^0.4.24;

contract HashStore {

    struct Entry {
        address source;
        uint blockNumber;
        uint blockTimestamp;
    }

    mapping (string => Entry) entries;

    function storeHash(string hash) public {
        if(entries[hash].source != 0x0) revert();
        Entry memory entry = Entry(msg.sender, block.number, block.timestamp);
        entries[hash] = entry;
    }

    function getSourceFromHash(string hash) public view returns(address) {
        return entries[hash].source;
    }

    function getBlockNumberFromHash(string hash) public view returns(uint) {
        return entries[hash].blockNumber;
    }

    function getBlockTimestampFromHash(string hash) public view returns(uint) {
        return entries[hash].blockTimestamp;
    }
}
