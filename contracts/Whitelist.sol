//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist{
  // Maximum number of whitelisted addreses allowed
  uint8 public maxWhitelistedAddresses;

  mapping(address => bool) public whitelistedAddresses;
  uint8 public whitelistCount;

  // Setting the max number of whitelisted addresses
  constructor(uint8 _maxWhitelistedAddresses){
    maxWhitelistedAddresses = _maxWhitelistedAddresses;
  } 

  //Adds the address of the sender to the whitelist
  function addAddressToWhitelist() public {
    //checing if user has already been whitelisted
    require(!whitelistedAddresses[msg.sender],"Sender has already been whitelisted");
    // Check if the whitelist Count is less than the max number
    require(whitelistCount < maxWhitelistedAddresses, "Sorry you are late :(, maximum limit reached");
    // Add the address which called the function
    whitelistedAddresses[msg.sender] = true;
    //Increase count 
    whitelistCount += 1;
    
  }

}