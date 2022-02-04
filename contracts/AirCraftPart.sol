// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// Imports
import "../client/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../client/node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../client/node_modules/@openzeppelin/contracts/utils/Counters.sol";

// Smart Contract AirCraftPart using ERC721 token standard
contract AirCraftPart is ERC721Enumerable, ERC721URIStorage {

  // ========================================
  // Variables/Mappings:
  // ========================================

  // Unique Token Identifier using Counters Library
  using Counters for Counters.Counter;
  Counters.Counter private tokenId;

  // Authority addresses
  mapping ( address => bool) internal authorities;

  // Validated flag for partIds
  mapping ( uint256 => bool) internal isValidated;

  // Password already set flag for address/user
  mapping ( address => bool) internal passwordSet;

  // KeyList of corresponding address/user
  mapping ( address => string) internal ownerToKeyList;

  // URI/hash with corresponding key shares
  mapping ( string => string) internal uriToKeyShare;

  // ========================================
  // Constructor: Set Name and Symbol of Contract, Initializing authorities
  // ========================================
  constructor() ERC721("AirCraftPart", "PART") {
    authorities[0xCD964d99c155369B3E4ae8EF2Aa83EF55bcebA9B] = true;
    authorities[0xf0Dd951142614Da97AB59e66827477530F7a0a50] = true;
  }

  // ========================================
  // Modifier: Allow only authority modifier
  // ========================================
  modifier onlyAuth {
    require(authorities[msg.sender], "AirCraftPart Validation: address not authorized!");
    _;
  }

  // ========================================
  // Function: Create a new aircraft part
  // ========================================
  function createAirCraftPart(string memory partURI) public {

    // Get current token Id
    uint256 tokenIdValue = tokenId.current();

    // Create new Token and set Metadata
    _mint(msg.sender, tokenIdValue);
    _setTokenURI(tokenIdValue, partURI);

    // Set to unvalidated part
    unvalidatePart(tokenIdValue);

    // Set Token Id for next aircraft part
    tokenId.increment();
  }

  // ========================================
  // Function: Add a new certificate to an aircraft part
  // ========================================
  function updateCertificateList (uint256 partId, string memory partURI) public {

    // Check if requester is authorized
    require(
      _isApprovedOrOwner(msg.sender, partId),
      "AirCraftPart: transfer caller is not owner nor approved"
    );

    // Check if partId exists
    require(
      _exists(partId),
      "AirCraftPart: part id does not exist"
    );

    // Update Certificate Hash List in Metadata
    _setTokenURI(partId, partURI);

    // Set to unvalidated part
    unvalidatePart(partId);
  }

  // ========================================
  // Function: Return all Certificates for an aircraft part
  // ========================================
  function getPartURI(uint256 partId) public view returns (string memory){
    return tokenURI(partId);
  }

  // ========================================
  // Function: Check if aircraft part exists by ID
  // ========================================
  function checkPartIdExist(uint256 partId) public view returns (bool){
    return _exists(partId);
  }

  // ========================================
  // Function: Get tokens of owner
  // ========================================
  function getTokensOfOwner(address _owner) external view returns( uint256[] memory ){

    // Get amount of tokens owned by address
    uint256 tokenCount = balanceOf(_owner);

    // Check if address has tokens
    if (tokenCount == 0) {

      // Return empty array
      return new uint256[](0);

    } else {

      // List of all tokens owned by address
      uint256[] memory ownerTokens = new uint256[](tokenCount);

      // Iterate throw all tokens owned by address and add them to the list
      for (uint256 i = 0; i < tokenCount; i++){
        ownerTokens[i] = tokenOfOwnerByIndex(_owner, i);
      }

      return ownerTokens;
    }
  }

  // ========================================
  // Function: Get all token URIs/hashes
  // ========================================
  function getAllTokenURIs() external onlyAuth view returns( string[] memory ){

    // Get amount of tokens owned by address
    uint256 tokenCount =  totalSupply();

    // Check if address has tokens
    if (tokenCount == 0) {

      // Return empty array
      return new string[](0);

    } else {

      // List of all tokens
      string[] memory tokenURIs = new string[](tokenCount);

      // Iterate throw all tokens and add them to the list
      for (uint256 i = 0; i < tokenCount; i++){
        uint256 tokenId = tokenByIndex(i);

        // Check if part is validated
        if( isValidated[tokenId] == false ){
          tokenURIs[i] = tokenURI(tokenId);
        }
      }

      return tokenURIs;
    }
  }

  // ============================
  // Validate an aircraft part
  // ============================
  function validatePart(uint256 partId) external onlyAuth {
    isValidated[partId] = true;
  }

  // ============================
  // Unvalidate an aircraft part
  // ============================
  function unvalidatePart(uint256 partId) internal {
    isValidated[partId] = false;
  }

  // ============================
  // Get validation status
  // ============================
  function getValidation(uint256 partId) external view returns (bool) {
    return isValidated[partId];
  }

  // ========================================
  // Function: Set key shares of authorities with corresponding URI/hash
  // ========================================
  function addKeyShares (string memory uri, string memory keyShares) public {
    uriToKeyShare[uri] = keyShares;
  }

  // ========================================
  // Function: Get key shares of authorities by URI/hash
  // ========================================
  function getKeyShares (string memory uri) public onlyAuth view returns (string memory) {
    return uriToKeyShare[uri];
  }

  // ========================================
  // Function: Set flag of user/addres that password has been assigned
  // ========================================
  function setPassword () public {
    passwordSet[msg.sender] = true;
  }

  // ========================================
  // Function: Get flag of user/addres whether password has been assigned
  // ========================================
  function getPassword () public view returns (bool) {
    return passwordSet[msg.sender];
  }

  // ========================================
  // Function: Get flag of user/addres whether password has been assigned
  // ========================================
  function getKeyList () public view returns (string memory) {
    return ownerToKeyList[msg.sender];
  }

  // ========================================
  // Function: Update URI/hash of keylist for corresponding user/address
  // ========================================
  function updateKeyList (string memory keyListURI) public {
    ownerToKeyList[msg.sender] = keyListURI;
  }

  // ============================
  // Override inherited function _beforeTokenTransfer
  // ============================
  function _beforeTokenTransfer(address from, address to, uint256 _tokenId) internal
  override(ERC721, ERC721Enumerable){
    super._beforeTokenTransfer(from, to, _tokenId);
  }

  // ============================
  // Override inherited function _burn
  // ============================
  function _burn(uint256 _tokenId) internal
  override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }

  // ============================
  // Override inherited function tokenURI
  // ============================
  function tokenURI(uint256 _tokenId) public view
  override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(_tokenId);
  }

  // ============================
  // Override inherited function supportsInterface
  // ============================
  function supportsInterface(bytes4 _interfaceId) public view
  override(ERC721, ERC721Enumerable) returns (bool){
    return super.supportsInterface(_interfaceId);
  }
}
