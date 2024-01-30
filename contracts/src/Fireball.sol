// SPDX-License-Identifier: MIT
// shittily hacked together by totty.eth
// Deployed to 0x9BdFEE0BC7C8eD3C618F510515746A2b45f70E3b

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fireball is ERC721, Ownable {
    address private _owner;
    address syndicateMinter = 0xcA0604f6EE1Ad08b6A0d9534A76115ac3E73479e;
    bool locked = false;
    bool useSyndicateLock = true;
    uint256 currentTokenId = 5;
    uint256 mintLimit = 420;
    string token_uri = "https://n765a3edxbrccoaccs73s6j5tlwmzrf2indgmgmjopkqweaasyyq.arweave.net/b_3QbIO4YiE4AhS_uXk9muzMxLpDRmYZiXPVCxAAljE";

    // Mapping to track whether an address has already minted a token
    mapping(address => bool) public hasMinted;

    constructor() ERC721("Fireball", "FIRE") {
        _owner = msg.sender;
        uint j = 1;
        while (j <= currentTokenId) {
            _mint(msg.sender, j);
            j++;
        }
    }

    function mint(address to) public {
        require(currentTokenId < mintLimit, "Minting limit reached");
        if (useSyndicateLock) {
            require(msg.sender == syndicateMinter, "Trying to mint outside of accepted minter");
        }
        require(!hasMinted[to], "Address has already minted a token");
        ++currentTokenId;
        hasMinted[to] = true;
        _mint(to, currentTokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return token_uri;
    }

    function lock() external onlyOwner {
        locked = true;
    }

    function setSyndicateMinter(address newMinter) external onlyOwner {
        syndicateMinter = newMinter;
    }

    function setSyndicateLock(bool newVal) external onlyOwner {
        useSyndicateLock = newVal;
    }

    function setTokenURI(string memory newUri) external onlyOwner {
        if (!locked) {
            token_uri = newUri;
        }
    }

    function setMintLimit(uint256 newLimit) external onlyOwner {
        if (!locked) {
            mintLimit = newLimit;
        }
    }

    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer Failed");
    }
}
