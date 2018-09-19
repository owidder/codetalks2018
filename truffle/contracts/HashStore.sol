pragma solidity ^0.4.24;
contract HashStore {

    event NewHashEntry(string);

    function addHashEntry(string hashValue) public {
        emit NewHashEntry(hashValue);
    }
}
