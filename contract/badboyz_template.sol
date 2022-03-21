  // SPDX-License-Identifier: MIT
    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/utils/math/SafeMath.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
    
    pragma solidity ^0.8.4;
    pragma abicoder v2;
    
    contract BadBoyz is ERC721, Ownable, ERC721Enumerable {
      using SafeMath for uint256;
      using Strings for uint256;
    
      uint256 public constant tokenPrice = 1900000000000000; // 0.0019 ETH 
      uint256 public constant maxTokenPurchase = 20;
      uint256 public constant MAX_TOKENS = 3333;
    
      string public baseURI = ""; // IPFS URI WILL BE SET AFTER ALL TOKENS SOLD OUT
    
      bool public saleIsActive = false;
      bool public presaleIsActive = false;
      bool public isRevealed = false;
    
      mapping(address => bool) private _presaleList;
      mapping(address => uint256) private _presaleListClaimed;
    
      uint256 public presaleMaxMint = 20;
      uint256 public devReserve = 64;

      // Payment Addresses
      address constant partner1 = 0xC79108A7151814A77e1916E61e0d88D5EA935c84;
      address constant partner2 = 0x1aBdDC3293Ec0b0909605A1Bc8939cF7E98a4E7a;
        
      event BadBoyzMinted(uint256 tokenId, address owner);
    
      constructor() ERC721("BadBoyz", "BBZ") {}
    
      function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
      }
    
      function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
      }
      //https://etherscan.io/address/0xAFeF885027A59603dfF7837C280DaD772c476b82#code    
      function withdraw() public payable onlyOwner {

        // partner1 10%
        (bool sm, ) = payable(partner1).call{value: address(this).balance * 100 / 1000}("");
        require(sm);
        // partner2 90%
        (bool mj, ) = payable(partner2).call{value: address(this).balance}("");
        require(mj);
      }
    
      function reveal() public onlyOwner {
        isRevealed = true;
      }
    
      function reserveTokens(address _to, uint256 _reserveAmount)
        external
        onlyOwner
      {
        require(
          _reserveAmount > 0 && _reserveAmount <= devReserve,
          "Not enough reserve left for team"
        );
        for (uint256 i = 0; i < _reserveAmount; i++) {
          uint256 id = totalSupply();
          _safeMint(_to, id);
        }
        devReserve = devReserve.sub(_reserveAmount);
      }
    
      function toggleSaleState() external onlyOwner {
        saleIsActive = !saleIsActive;
        presaleIsActive = false;
      }
    
      function togglePresaleState() external onlyOwner {
        presaleIsActive = !presaleIsActive;
        saleIsActive = false;
      }

      function currentPresaleStatus() view public returns (bool) {
        return presaleIsActive;
      }
    
      function tokensOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
      {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
          // Return an empty array
          return new uint256[](0);
        } else {
          uint256[] memory result = new uint256[](tokenCount);
          uint256 index;
          for (index = 0; index < tokenCount; index++) {
            result[index] = tokenOfOwnerByIndex(_owner, index);
          }
          return result;
        }
      }
    
      function mintBadBoyz(uint256 numberOfTokens) external payable {
        require(saleIsActive, "Sale must be active to mint Token");
        require(
          numberOfTokens > 0 && numberOfTokens <= maxTokenPurchase,
          "Can only mint one or more tokens at a time"
        );
        require(
          totalSupply().add(numberOfTokens) <= MAX_TOKENS,
          "Purchase would exceed max supply of tokens"
        );
        require(
          msg.value >= tokenPrice.mul(numberOfTokens),
          "Ether value sent is not correct"
        );
    
        for (uint256 i = 0; i < numberOfTokens; i++) {
          uint256 id = totalSupply().add(1);
          if (totalSupply() < MAX_TOKENS) {
            _safeMint(msg.sender, id);
            emit BadBoyzMinted(id, msg.sender);
          }
        }
      }
    
      function presaleBadBoyz(uint256 numberOfTokens) external payable {
        require(presaleIsActive, "Presale is not active");
        require(_presaleList[msg.sender], "You are not on the Presale List");
        require(
          totalSupply().add(numberOfTokens) <= MAX_TOKENS,
          "Purchase would exceed max supply of token"
        );
        require(
          numberOfTokens > 0 && numberOfTokens <= presaleMaxMint,
          "Cannot purchase this many tokens"
        );
        require(
          _presaleListClaimed[msg.sender].add(numberOfTokens) <= presaleMaxMint,
          "Purchase exceeds max allowed"
        );
        require(
          msg.value >= tokenPrice.mul(numberOfTokens),
          "Ether value sent is not correct"
        );
    
        for (uint256 i = 0; i < numberOfTokens; i++) {
          uint256 id = totalSupply().add(1);
          if (totalSupply() < MAX_TOKENS) {
            _presaleListClaimed[msg.sender] += 1;
            _safeMint(msg.sender, id);
            emit BadBoyzMinted(id, msg.sender);
          }
        }
      }
    
      function addToPresaleList(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
          require(addresses[i] != address(0), "Can't add the null address");
    
          _presaleList[addresses[i]] = true;
        }
      }
    
      function removeFromPresaleList(address[] calldata addresses)
        external
        onlyOwner
      {
        for (uint256 i = 0; i < addresses.length; i++) {
          require(addresses[i] != address(0), "Can't add the null address");
    
          _presaleList[addresses[i]] = false;
        }
      }
    
      function setPresaleMaxMint(uint256 maxMint) external onlyOwner {
        presaleMaxMint = maxMint;
      }
    
      function onPreSaleList(address addr) external view returns (bool) {
        return _presaleList[addr];
      }
    
      function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
      {
        require(
          _exists(tokenId),
          "ERC721Metadata: URI query for nonexistent token"
        );
    
        string memory currentBaseURI = _baseURI();
    
        if (isRevealed == false) {
          return
            "ipfs://QmdRGEsjTDXb8D81t3yUK8TSe1DqY8BuTRyRCERC65AW78/1.json";
        }
    
        return
          bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), ".json"))
            : "";
            
      }
    
      function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
      ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
      }
    
      function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
      {
        return super.supportsInterface(interfaceId);
      }
    }
