pragma solidity ^0.7.4; 

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './Hash.sol';

contract HTLC{
    
    uint public startTime;
    uint public lockTime = 10000;
    bytes32 public hash;
    string public secret;
    Hash public hashContract;
    address public recipient;
    address public owner;
    uint public amount;
    IERC20 public token;
    
    
    constructor(string memory _secret,address _recipient,address _token,uint256 _amount) public {
        hashContract = new Hash();
        hash = hashContract.calculateHash(_secret);
        owner = msg.sender;
        recipient = _recipient;
        token= IERC20(_token);
        amount=_amount;
     
    }
    
    
    function fund() external{
        startTime = block.timestamp;
        token.transferFrom(msg.sender,address(this),amount);
    }
    
    
    function withdraw(string memory _secret)public{
        require(hashContract.calculateHash(_secret) == hash,'wrong secret');
        secret = _secret;
        token.transfer(recipient,amount);
    }
    
    function refund() public{
        require(block.timestamp>startTime+lockTime,'too early');
        token.transfer(owner,amount);
    }
}