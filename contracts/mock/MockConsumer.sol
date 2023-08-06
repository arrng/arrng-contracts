// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../consumer/ArrngConsumer.sol";

contract MockConsumer is ArrngConsumer, ERC721, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;
  using Strings for uint256;
  uint256 public immutable supply;

  Counters.Counter private _tokenIdCounter;
  bool revealed;
  string public prerevealURI;
  string public baseURI;
  uint256 public arrngRequestId;
  uint256 public offset;

  constructor(
    uint256 supply_,
    string memory prerevealURI_,
    string memory baseURI_,
    address arrngController_
  ) ERC721("MockConsumer", "NOM") ArrngConsumer(arrngController_) {
    prerevealURI = prerevealURI_;
    baseURI = baseURI_;
    supply = supply_;
  }

  function safeMint() public {
    uint256 tokenId = _tokenIdCounter.current();
    require(tokenId < supply, "Amazing NFT is minted out");
    _tokenIdCounter.increment();
    _safeMint(msg.sender, tokenId);
  }

  function reveal() public payable onlyOwner {
    arrngRequestId = arrngController.requestRandomWords{value: msg.value}(1);
  }

  function fulfillRandomWords(
    uint256,
    uint256[] memory randomWords
  ) internal override {
    offset = randomWords[0];
    revealed = true;
  }

  function tokenURI(
    uint256 tokenId
  ) public view virtual override(ERC721) returns (string memory) {
    _requireMinted(tokenId);

    if (!revealed) {
      return
        bytes(prerevealURI).length > 0
          ? string(abi.encodePacked(prerevealURI))
          : "";
    } else {
      return
        bytes(baseURI).length > 0
          ? string(
            abi.encodePacked(
              baseURI,
              ((tokenId + offset) % supply).toString(),
              ".json"
            )
          )
          : "";
    }
  }
}
