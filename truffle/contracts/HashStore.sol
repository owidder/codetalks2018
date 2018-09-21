pragma solidity ^0.4.24;

contract HashStore {

    struct Entry {
        address source;
        uint blockNumber;
        uint blockTimestamp;
    }
    
    mapping (string => Entry[]) entries;

    function storeHash(string hash) public {
        Entry memory entry = Entry(msg.sender, block.number, block.timestamp);
        entries[hash].push(entry);
    }

    function getEntriesFromHash(string hash) public view returns(Entry[]) {
        return entries[hash];
    }
}
