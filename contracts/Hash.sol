pragma solidity ^0.7.4; 

contract Hash{
    
    function calculateHash(string calldata _key) external pure returns(bytes32){
        return keccak256(abi.encodePacked(_key));
    }
}