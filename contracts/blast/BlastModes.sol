// SPDX-License-Identifier: MIT

/**
 *
 * @title IYieldModes.sol. Interface for shared BLAST yield modes.
 *
 * @author arrng.io, source courtesy of blast.io
 *
 */

pragma solidity 0.8.19;

enum YieldMode {
  AUTOMATIC,
  VOID,
  CLAIMABLE
}

enum GasMode {
  VOID,
  CLAIMABLE
}
