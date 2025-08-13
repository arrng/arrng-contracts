// SPDX-License-Identifier: MIT

/**
 *
 * @title IWETHUSDBRebasing.sol. Interface for BLAST standard ERC20s.
 *
 * @author arrng.io, source courtesy of blast.io
 *
 */

pragma solidity ^0.8.0;

import {YieldMode, GasMode} from "./BlastModes.sol";

interface IWETHUSDBRebasing {
  // changes the yield mode of the caller and update the balance
  // to reflect the configuration
  function configure(YieldMode) external returns (uint256);
}
