pragma solidity ^0.4.24;
contract TextStore {

    event NewTextEntry(string);

    function addTextEntry(string text) public {
        emit NewTextEntry(text);
    }
}
