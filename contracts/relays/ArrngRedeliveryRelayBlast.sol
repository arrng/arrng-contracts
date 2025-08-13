// SPDX-License-Identifier: BUSL-1.1

/**
 *
 * @title ArrngRedeliveryRelay.sol. Contract for relaying redelivery requests.
 *
 * @author arrng https://arrng.io/
 *
 */

import {IArrngRedeliveryRelay} from "./IArrngRedeliveryRelay.sol";
import {YieldMode, GasMode, IBlast} from "../blast/IBlast.sol";
import {IWETHUSDBRebasing} from "../blast/IWETHUSDBRebasing.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

contract ArrngRedeliveryRelay is IArrngRedeliveryRelay, Ownable {
  // Address of the oracle:
  address payable public oracleAddress;

  // Address of the blast yield and gas controller:
  IBlast public blastYieldAndGasController;

  // Address of the blast WETH contract:
  IWETHUSDBRebasing public blastWETH;

  // Address of the blast USDB contract:
  IWETHUSDBRebasing public blastUSDB;

  /**
   *
   * @dev constructor
   *
   */
  constructor() {
    _transferOwnership(tx.origin);
    oracleAddress = payable(0x24a088AC51871780fCc4c3b02FAfB0b4e0C98B4e);
  }

  /**
   *
   * @dev initialisation: separated from the constructor to allow identical
   * deployment bytecode accross chains with different contract addresses.
   *
   * @param blastYieldAndGasController_: Address of the blast yield and gas controller.
   * @param blastWETH_: Address of the blast WETH contract on this chain.
   * @param blastUSDB_: Address of the USDB ERC-20 on this chain.
   *
   */
  function initialisation(
    address blastYieldAndGasController_,
    address blastWETH_,
    address blastUSDB_
  ) external onlyOwner {
    blastYieldAndGasController = IBlast(blastYieldAndGasController_);
    blastWETH = IWETHUSDBRebasing(blastWETH_);
    blastUSDB = IWETHUSDBRebasing(blastUSDB_);
    blastYieldAndGasController.configureClaimableYield();
    blastYieldAndGasController.configureClaimableGas();
    blastYieldAndGasController.configureGovernor(owner());
    blastWETH.configure(YieldMode.CLAIMABLE);
    blastUSDB.configure(YieldMode.CLAIMABLE);
  }

  /**
   *
   * @dev setOracleAddress: set a new oracle address
   *
   * @param oracle_: the new oracle address
   *
   */
  function setOracleAddress(address payable oracle_) external onlyOwner {
    require(oracle_ != address(0), "Oracle address cannot be address(0)");
    oracleAddress = oracle_;
    emit OracleAddressSet(oracle_);
  }

  /**
   *
   * @dev requestRedelivery: request redelivery of rng. Note that this will
   * ONLY succeed if the original delivery was not sucessful (e.g. when
   * requested with insufficient native token for gas).
   *
   * The use of this method will have the following outcomes:
   * - Original delivery was SUCCESS: no redelivery, excess native token refunded to the
   * provided refund address
   * - There was no original delivery (request ID not found): no redelivery,
   * excess native token refunded to the provided refund address
   * - There was a request and it failed: redelivery of rng as per original
   * request IF there is sufficient native token on this call. Otherwise, refund
   * of excess native token.
   *
   * requestRedelivery is overloaded. In this instance you can
   * call it without explicitly declaring a refund address, with the
   * refund being paid to the msg.sender for this call.
   *
   * @param arrngRequestId_: the Id of the original request
   *
   */
  function requestRedelivery(uint256 arrngRequestId_) external payable {
    requestRedelivery(arrngRequestId_, msg.sender);
  }

  /**
   *
   * @dev requestRedelivery: request redelivery of rng. Note that this will
   * ONLY succeed if the original delivery was not sucessful (e.g. when
   * requested with insufficient native token for gas).
   *
   * The use of this method will have the following outcomes:
   * - Original delivery was SUCCESS: no redelivery, excess native token refunded to the
   * provided refund address
   * - There was no original delivery (request ID not found): no redelivery,
   * excess native token refunded to the provided refund address
   * - There was a request and it failed: redelivery of rng as per original
   * request IF there is sufficient native token on this call. Otherwise, refund
   * of excess native token.
   *
   * requestRedelivery is overloaded. In this instance you must
   * specify the refund address for unused native token.
   *
   * @param arrngRequestId_: the Id of the original request
   * @param refundAddress_: the address for refund of ununsed native token
   *
   */
  function requestRedelivery(
    uint256 arrngRequestId_,
    address refundAddress_
  ) public payable {
    _requestRedelivery(arrngRequestId_, msg.sender, msg.value, refundAddress_);
  }

  /**
   *
   * @dev _requestRedelivery: request redelivery of rng. Note that this will
   * ONLY succeed if the original delivery was not sucessful (e.g. when
   * requested with insufficient native token for gas).
   *
   * The use of this method will have the following outcomes:
   * - Original delivery was SUCCESS: no redelivery, excess native token refunded to the
   * provided refund address
   * - There was no original delivery (request ID not found): no redelivery,
   * excess native token refunded to the provided refund address
   * - There was a request and it failed: redelivery of rng as per original
   * request IF there is sufficient native token on this call. Otherwise, refund
   * of excess native token.
   *
   * @param arrngRequestId_: the Id of the original request
   * @param caller_: the msg.sender that has made this call
   * @param payment_: the msg.value sent with the call
   * @param refundAddress_: the address for refund of ununsed native token
   *
   */
  function _requestRedelivery(
    uint256 arrngRequestId_,
    address caller_,
    uint256 payment_,
    address refundAddress_
  ) internal {
    // Forward funds to the oracle:
    (bool success, ) = oracleAddress.call{value: payment_}("");
    require(success, "Error requesting redelivery");

    // Request redelivery:
    emit ArrngRedeliveryRequest(
      uint64(arrngRequestId_),
      caller_,
      uint96(payment_),
      refundAddress_
    );
  }
}
