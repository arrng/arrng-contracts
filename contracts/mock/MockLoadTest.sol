// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../consumer/ArrngConsumer.sol";

contract MockLoadTest is ArrngConsumer, Ownable {
  mapping(uint256 => uint256) public requestIdToResult;

  constructor(address arrngController_) ArrngConsumer(arrngController_) {}

  function loadTest(uint256 numberOfRequests_) public payable onlyOwner {
    uint256 valuePerCall = msg.value / numberOfRequests_;
    for (uint256 i = 0; i < numberOfRequests_; i++) {
      arrngController.requestRandomWords{value: valuePerCall}(1);
    }
  }

  function fulfillRandomWords(
    uint256 requestId_,
    uint256[] memory randomWords_
  ) internal override {
    requestIdToResult[requestId_] = randomWords_[0];
  }
}
