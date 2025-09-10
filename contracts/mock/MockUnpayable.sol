// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract MockUnpayable {
  receive() external payable {
    revert("Unpayable");
  }
}
