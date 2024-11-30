// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLock {
    address public owner;
    uint256 public unlockTime;
    uint256 public lockedAmount;

    constructor() {
        owner = msg.sender;
    }

    // Deposit Ether and set the unlock time
    function deposit(uint256 timeInSeconds) external payable {
        require(msg.sender == owner, "Only the owner can deposit funds.");
        require(msg.value > 0, "You must deposit some Ether.");
        require(lockedAmount == 0, "currently locked.");

        lockedAmount = msg.value;
        unlockTime = block.timestamp + timeInSeconds;
    }

    // Withdraw Ether after the unlock time
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds.");
        require(block.timestamp >= unlockTime, "Funds are still locked.");
        require(lockedAmount > 0, "No funds available to withdraw.");

        uint256 amount = lockedAmount;
        lockedAmount = 0;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed.");
    }

    // View contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}