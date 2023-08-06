// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MockERC721 is ERC721, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("MockERC721", "M721") {}

  function safeMint20(address to_) public {
    for (uint256 i = 0; i < 20; i++) {
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(to_, tokenId);
    }
  }

  function safeMint10() public {
    for (uint256 i = 0; i < 10; i++) {
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(msg.sender, tokenId);
    }
  }

  function safeMint() public {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(msg.sender, tokenId);
  }

  function mintAMassiveTokenId() public {
    uint256 tokenId = (_tokenIdCounter.current() + 4294967296);
    _tokenIdCounter.increment();
    _safeMint(msg.sender, tokenId);
  }

  function mintAGargantuanTokenId() public {
    uint256 tokenId = (_tokenIdCounter.current() +
      115792089237316195423570985008687907853269984665640564039457584007913129639935);
    _tokenIdCounter.increment();
    _safeMint(msg.sender, tokenId);
  }
}
