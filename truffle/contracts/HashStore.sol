pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract HashStore {

    struct Entry {
        address source;
        uint blockNumber;
        uint blockTimestamp;
    }

    string public s = "s";
    
    mapping (string => Entry) entries;

    function storeHash(string hash) public {
        if(entries[hash].source != 0x0) throw;
        Entry memory entry = Entry(msg.sender, block.number, block.timestamp);
        entries[hash] = entry;
    }

    function getEntryFromHash(string hash) public view returns(Entry) {
        return entries[hash];
    }
}
