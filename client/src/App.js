// ============================
// Imports
// ============================
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import getWeb3 from "./getWeb3";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";
import AirCraftPartContract from "./contracts/AirCraftPart.json";
import Home from './Home';
import Cards from './Cards';
import FormOne from './FormOne';
import Ata from './Ata';
import UploadCertificate from './UploadCertificate';
import ShowCertificate from './ShowCertificate';
import Validation from './Validation';
import boilerplatePartMetaData from './assets/PartMetaData.json';
import boilerplateKeyList from './assets/KeyList.json';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'secrets.js';
import EthCrypto from 'eth-crypto';

// ============================
// Parent component
// ============================
class App extends Component {

  constructor(props) {
    super(props)

    // Set initial values of state
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      partURI: '',
      partId: '',
      partList: '',
      masterKey: '',
      disabled: ''
    }

    // Bind all functions
    this.authenticateUser = this.authenticateUser.bind(this);
    this.generateRandKey = this.generateRandKey.bind(this);
    this.decryption = this.decryption.bind(this);
    this.getKey = this.getKey.bind(this);
    this.shareWithAuthorities = this.shareWithAuthorities.bind(this);
    this.generateSecret = this.generateSecret.bind(this);
    this.reconstructSecret = this.reconstructSecret.bind(this);
    this.encryption = this.encryption.bind(this);
    this.ipfsUpload = this.ipfsUpload.bind(this);
    this.ipfsDownload = this.ipfsDownload.bind(this);
    this.onSubmitAddCertificate = this.onSubmitAddCertificate.bind(this);
    this.captureCertificate = this.captureCertificate.bind(this);
    this.onSubmitAirCraftPart = this.onSubmitAirCraftPart.bind(this);
    this.addCertificate = this.addCertificate.bind(this);
    this.getTokensbyAddress = this.getTokensbyAddress.bind(this);
    this.getListofAllTokenURIs = this.getListofAllTokenURIs.bind(this);
    this.addToKeyList = this.addToKeyList.bind(this);
    this.getListOfAllParts = this.getListOfAllParts.bind(this);
    this.getListOfParts = this.getListOfParts.bind(this);
    this.onSubmitValidateAirCraftPart = this.onSubmitValidateAirCraftPart.bind(this);
  }

  // ============================
  // Function: First call of page
  // ============================
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AirCraftPartContract.networks[networkId];

      // Check if network is deployed
      if(deployedNetwork){
        const AirCraftPartInstance = new web3.eth.Contract(
          AirCraftPartContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state
        this.setState({ web3, accounts, contract: AirCraftPartInstance });

      }

      // User login/sign up
      await this.authenticateUser();

      // Check if authority is logged in or disable validation page
      if( accounts[0] != '0xCD964d99c155369B3E4ae8EF2Aa83EF55bcebA9B' && accounts[0] != '0xf0Dd951142614Da97AB59e66827477530F7a0a50' ){
        this.setState({ disabled: 'disabled-link' });
      }

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // ============================
  // Function: Login/signup of user/address
  // ============================
  authenticateUser = async () => {

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    const pw = await contract.methods.getPassword().call({ from: accounts[0] });

    // If password wasn't set yet, user is asked to do so
    if(!pw){
      const key = await window.prompt("You haven't set any password. Set your password.");
      await contract.methods.setPassword().send({ from: accounts[0] });
      this.setState({ masterKey: key });

      // Upload new keyList and get respective URI from IPFS
      const newKeyListURI = await this.ipfsUpload(boilerplateKeyList, this.state.masterKey);

      // Update keyList URI of owner/address
      await contract.methods.updateKeyList(newKeyListURI).send({ from: accounts[0] });

    // If password was set already, user is asked to provide it upon each site refresh
    }else{
      const key = await window.prompt("Provide your password.");

      // Set password to the state
      this.setState({ masterKey: key });
    }
  }

  // ============================
  // Function: Generate random key
  // ============================
  generateRandKey = async () => {

    // Generate a random number
    var randomstring = Math.random().toString(36).slice(-8);

    return randomstring;
  }

  // ============================
  // Function: decryption of encrypted input
  // ============================
  decryption = async (fetchOutput, key) => {

    // Decode uint array to string
    var decoder = new TextDecoder("utf-8");
    var decodedOutput = decoder.decode(fetchOutput.value);

    // Remove faulty literals at front and end of the string
    decodedOutput = decodedOutput.replace(/[^A-Fa-f0-9]/g, "");

    //use library
    const crypto = require('crypto');

    // Decrypt ipfs data with advanced encryption standard
    const decipher = crypto.createDecipher('aes192', key);

    var decrypted = decipher.update(decodedOutput, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Return string as json
    return JSON.parse(decrypted);
  }

  // ============================
  // Function: Get key for IPFS hash
  // ============================
  getKey = async (hash) => {

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    // Get URI of key list for respective address/user
    const keyListURI = await contract.methods.getKeyList().call({ from: accounts[0] });

    // Download key list by URI
    const keyList = await this.ipfsDownload(keyListURI, this.state.masterKey);

    // demo
    console.log("keyList", keyList);

    // Find key of hash
    for( var i = 0; i < keyList.keyListPairs.length; i++ ){
      if( keyList.keyListPairs[i][0] == hash ){
        return keyList.keyListPairs[i][1];
      }
    }
  }

  // ============================
  // Function: Generate Secret
  // ============================
  shareWithAuthorities = async (uri, key) => {

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    var encryptedList = [];

    // Divide key in multiple shares
    const shares = await this.generateSecret(key);

    // Initialize private keys of the two provided authority addresses
    const privateKey = ['23d1ce8f621463615cf53927148ede6514e594b9778ce2c92b04321b22bda0d7','c96939259418799c2b92bc75c193d7863cac6e208f266f6f5c3aef0f32c513ec'];

    // Encrypt with public keys of authorities
    for(var i = 0; i < privateKey.length; i++){

      // Get public key of address by private key
      const publicKey = await EthCrypto.publicKeyByPrivateKey(
        privateKey[i]
      );

      // Encrypt key share and push to list of encrypted key shares
      encryptedList.push(await EthCrypto.encryptWithPublicKey(publicKey, shares[i]));

    }

    // Store encrypted key shares of authorities
    await contract.methods.addKeyShares(uri, JSON.stringify(encryptedList)).send({ from: accounts[0] });

  }

  // ============================
  // Function: Generate Secret
  // ============================
  generateSecret = async (key) => {

    //Load library
    var secrets = require("secrets.js");

    // split into 2 shares with a threshold of 2
    var shares = await secrets.share(secrets.str2hex(key), 2, 2);

    return shares;
  }

  // ============================
  // Function: Reconstruct Secret
  // ============================
  reconstructSecret = async (shares) => {

    var secrets = require("secrets.js");

    // Combine key shares to one share
    var comb = secrets.combine(shares);

    // demo
    console.log("Combined key:", secrets.hex2str(comb));

    return secrets.hex2str(comb);
  }

  // ============================
  // Function: Encrypt json data
  // ============================
  encryption = async (data, key) =>{

    // Data to string
    const str = JSON.stringify(data);

    // Encrypting data with advanced encryption standard
    const crypto = require('crypto');
    const cipher = crypto.createCipher('aes192', key);
    var encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted = encrypted + cipher.final('hex');

    return encrypted;
}

  // ============================
  // Function: Upload file to IPFS
  // ============================
  ipfsUpload = async (data, key) =>{

    // Encrypt data
    const encryptedData = await this.encryption(data, key);
	const auth = 'Basic ' + Buffer.from('2PH0wsFbxuPFOGi0c54vhTUAoG4' + ':' + '42bcfa3a24e927e339f3ec1106e4661f').toString('base64');

    try {
      // Set IPFS client and upload data to IPFS
	  
      
	  const ipfsClient = ipfsHttpClient({url: 'https://ipfs.infura.io:5001/api/v0/add?pin=true', headers: {authorization: auth}});
      const added = await ipfsClient.add(
        Buffer.from(encryptedData),
        {
          progress: (prog) => console.log(` IPFS received: ${prog}`)
        }
      );

      // Return IPFS hash
      return added.path;

    } catch (error){
      alert(
        `Failed to upload to IPFS.` + auth,
      );
      console.error(error)
    }
  }

  // ============================
  // Function: Get certificates from IPFS
  // ============================
  ipfsDownload = async (ipfsHash, key) => {

    try {

      // Get file from IPFS by hash/URI
	  const auth = 'Basic ' + Buffer.from('2PH0wsFbxuPFOGi0c54vhTUAoG4' + ':' + '42bcfa3a24e927e339f3ec1106e4661f').toString('base64');
      const fetchOutput = await fetch(`https://ipfs.infura.io:5001/api/v0/block/get?arg=${ipfsHash}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json', Authorization: auth},
      }).then(res => {
        return res.body.getReader().read( );
      });

      // Decrypt data with key and transform to json
      const jsonOutput = await this.decryption(fetchOutput, key);

      return jsonOutput;

    } catch (error) {
      console.log("Error at fetch", error)
    }

  }

  // ============================
  // Function: Submit handler for adding a new certificate
  // ============================
  onSubmitAddCertificate = async (formData) =>{

    // Set partId for which the certificate will be added
    const formPartId = formData.partId;

    // Remove partId from data
    delete formData.partId;

    // Add certificate data to respective part
    this.addCertificate(formPartId, formData);

  }

  // ============================
  // Function: Get and convert the uploaded file
  // ============================
  captureCertificate = async (event) => {

    // Prevent reload of website
    event.preventDefault();

    // Get file from input field
    const file = event.target.files[0];

    // Read file as array buffer
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {

      // Decode uint array to string
      var decoder = new TextDecoder("utf-8");
      var decodedResult = decoder.decode(reader.result);

      this.setState( { uploadCertificate: JSON.parse(decodedResult) });
    }

  }

  // ============================
  // Function: Create a new aircraft part
  // ============================
  onSubmitAirCraftPart = async (event, description) => {

    // Prevent reload of website
    event.preventDefault();

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    // Set Metadata of aircraft part
    var metadata = boilerplatePartMetaData;
    metadata["Description"] = description;

    try {

      // Write metadata to IPFS
      var randomKey = await this.generateRandKey();
      const partURI = await this.ipfsUpload(metadata, randomKey);

      // Store IPFS hash as URI in smart contract
      this.setState({ partURI: partURI });

      // IPFS hash with respective rand key are added to keyList
      this.addToKeyList(partURI, randomKey);

      // Share with Authorities
      this.shareWithAuthorities(partURI, randomKey);

      // Create new aircraft part token on blockchain
      await contract.methods.createAirCraftPart(this.state.partURI).send({ from: accounts[0] });

    } catch (error) {
      console.error('Error uploading file: ', error)
    }
  }

  // ============================
  // Function: Add a new certificate to aircraft part
  // ============================
  addCertificate = async (partId, formData) => {

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    try{

      // Check if partId exists
      const partIdExist = await contract.methods.checkPartIdExist(partId).call({ from: accounts[0] });

      // Check for partId
      if (partIdExist == false) {
        console.error("PartId does not exist")

        alert(
          `PartId does not exist.`,
        );

        throw new Error("partIdExist false");

      };

      // Get partURI from smart contract AirCraftPart with partID
      const partURI = await contract.methods.getPartURI(partId).call({ from: accounts[0] });

      // Get generated key for the URI
      const key = await this.getKey(partURI);

      // Get aircraft part metadata from IPFS with partURI and key
      var partMetaData = await this.ipfsDownload(partURI, key);

      // Generate a new random key for the certificate
      const rndmCertificateKey = await this.generateRandKey();

      // Upload certificate to IPFS
      const certificateURI = await this.ipfsUpload(formData, rndmCertificateKey);

      // Add certificate URI and respective key to key list
      await this.addToKeyList(certificateURI, rndmCertificateKey);

      // Share with Authorities
      this.shareWithAuthorities(certificateURI, rndmCertificateKey);

      // Add IPFS hash of certificate to metadata of aircraft part
      partMetaData.Certificates.push(certificateURI);

      // Generate new random key for updated part metadata
      const rndmMetaDataKey = await this.generateRandKey();

      // Upload new part metadata to IPFS
      const newPartURI = await this.ipfsUpload(partMetaData, rndmMetaDataKey);

      // Add new part metadata URI and key to keylist
      this.addToKeyList(newPartURI, rndmMetaDataKey);

      // Share with Authorities
      this.shareWithAuthorities(newPartURI, rndmMetaDataKey);

      // Update partURI with new IPFS hash
      await contract.methods.updateCertificateList(partId, newPartURI).send({ from: accounts[0] });

      } catch (error) {
          console.error('Error adding file: ', error);
      }
  }

  // ============================
  // Function: Get all tokenIds owned by an address
  // ============================
  getTokensbyAddress = async () =>{

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    try{

      // Get list of tokenIds
      const tokens = await contract.methods.getTokensOfOwner(this.state.accounts[0]).call({ from: accounts[0] });

      return tokens;

    } catch (error) {
      console.error('Error displaying list: ', error);
    }
  }

  // ============================
  // Function: Get all tokenIds owned by an address (only Authorities)
  // ============================
  getListofAllTokenURIs = async () =>{

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    try{

      // Get list of tokenURIs
      const tokens = await contract.methods.getAllTokenURIs().call({ from: accounts[0] });

      return tokens;

    } catch (error) {
      console.error('Error displaying list: ', error);
    }
  }

  // ============================
  // Function: Add tuple (file hash, key) to KeyList
  // ============================
  addToKeyList = async (hash, key) => {

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    // Retrieve URI of keyList
    const keyListURI = await contract.methods.getKeyList().call({ from: accounts[0] });

    // Download keyList by URI from IPFS
    const keyList = await this.ipfsDownload(keyListURI, this.state.masterKey)

    // Add hash of file and random key to keyList
    var tuple = [hash, key];
    keyList.keyListPairs.push(tuple);

    // Upload new keyList and get respective URI from IPFS
    const newKeyListURI = await this.ipfsUpload(keyList, this.state.masterKey);

    // Update keyList URI of owner/address
    await contract.methods.updateKeyList(newKeyListURI).send({ from: accounts[0] });
  }

  // ============================
  // Function: Get all tokenIds for all users (only Authorities)
  // ============================
  getListOfAllParts = async () =>{

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    // Hard coded private keys of authorities
    const privateKey = ['23d1ce8f621463615cf53927148ede6514e594b9778ce2c92b04321b22bda0d7','c96939259418799c2b92bc75c193d7863cac6e208f266f6f5c3aef0f32c513ec'];

    // Check if password of user/address is provided
    if(this.state.masterKey == ''){
      return;
    }

    // Get all tokens/parts of an owner/address
    var uriList = await this.getListofAllTokenURIs();

    var partList = [];

    // Iterate through all tokens/parts and get metadata
    for ( var i = 0; i < uriList.length; i++ ) {

      const decryptedKeyShares = [];

      // Check if uriList is empty
      if( uriList[i] == '' ){
        continue;
      }

      // Get encrypted key shares from blockchain
      var encryptedKeyShares = await contract.methods.getKeyShares(uriList[i]).call({ from: accounts[0] });

      // keyShares to JSON
      encryptedKeyShares = JSON.parse(encryptedKeyShares);

      // Decrypt all key shares with private key
      for(var j = 0; j < privateKey.length; j++){

        // EthCrypto cipher and parse string to JSON
        const encryptedObject = await EthCrypto.cipher.parse(encryptedKeyShares[j]);

        // Decrypt key shares with private key of authorities
        decryptedKeyShares.push(await EthCrypto.decryptWithPrivateKey(privateKey[j], encryptedObject));
      }

      // Combine key shares
      const key = await this.reconstructSecret(decryptedKeyShares);

      // Download respective MetaData from IPFS
      var partMetaData = await this.ipfsDownload(uriList[i], key);

      // Insert line break in certificate list
      var certificateList = JSON.stringify(partMetaData.Certificates);
      certificateList = certificateList.replace(/,/g,',<br>').replace('[','').replace(']','').replace(/"/g,'');

      // Append metadata set of part
      var dataset = {"partId": i, "description": partMetaData.Description, "certificates": certificateList, "isValidated": false};
      partList.push(dataset);
    }

    return partList;
  }

  // ============================
  // Function: Get all tokenIds owned by an address
  // ============================
  getListOfParts = async () =>{

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    // Check if masterKey of user/address is provided
    if(this.state.masterKey == ''){
      return;
    }

    // Get all tokens/parts of an owner/address
    var tokenList = await this.getTokensbyAddress();

    var partList = [];

    // Iterate throw all tokens/parts and get Metadata
    for (var i = 0; i < tokenList.length; i++) {

      // Get MetaData URI of part ID
      const partURI = await contract.methods.getPartURI(tokenList[i]).call({ from: accounts[0] });

      const key = await this.getKey(partURI);

      // Download respective MetaData from IPFS
      var partMetaData = await this.ipfsDownload(partURI, key);

      // Insert line break in certificate list
      var certificateList = JSON.stringify(partMetaData.Certificates);
      certificateList = certificateList.replace(/,/g,',<br>').replace('[','').replace(']','').replace(/"/g,'');

      // Get validation status of part
      const isValidated = await contract.methods.getValidation(tokenList[i]).call({ from: accounts[0] });

      var dataset = {"partId": tokenList[i], "description": partMetaData.Description, "certificates": certificateList, "isValidated": isValidated};
      partList.push(dataset);
    }

    return partList;
  }

  // ============================
  // Function: Validate an aircraft part by ID
  // ============================
  onSubmitValidateAirCraftPart = async (event, partId) =>{

    event.preventDefault();

    // Get Eth web3 accounts and deployed smart contract
    const { accounts, contract } = this.state;

    const decryptedKeyShares = [];

    // Hard coded private keys of authorities
    const privateKey = ['23d1ce8f621463615cf53927148ede6514e594b9778ce2c92b04321b22bda0d7','c96939259418799c2b92bc75c193d7863cac6e208f266f6f5c3aef0f32c513ec'];

    // Get partURI from smart contract AirCraftPart with partID
    const partURI = await contract.methods.getPartURI(partId).call({ from: accounts[0] });

    // Get encrypted key shares from blockchain
    var encryptedKeyShares = await contract.methods.getKeyShares(partURI).call({ from: accounts[0] });
    encryptedKeyShares = JSON.parse(encryptedKeyShares);

    // demo
    console.log("encryptedKeyShares", encryptedKeyShares);

    // Decrypt all key shares with private key
    for(var i = 0; i < privateKey.length; i++){

      // EthCrypto cipher and parse string to JSON
      const encryptedObject = await EthCrypto.cipher.parse(encryptedKeyShares[i]);

      // Decrypt key shares and add to list of shares
      decryptedKeyShares.push(await EthCrypto.decryptWithPrivateKey(privateKey[i], encryptedObject));
    }

    // Combine shares
    await this.reconstructSecret(decryptedKeyShares);

    // Validate respective part
    await contract.methods.validatePart(partId).send({ from: accounts[0] });
  }

  // ============================
  // Render HTML elements
  // ============================
  render() {

    // Check if web3 instance is loaded
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }

    return (
      <Router>
        <div className="App">

          <nav className="navbar flex-md-nowrap p-0 shadow-lg">

            <a className="navbar-brand" href="https://www.wiwiss.fu-berlin.de/fachbereich/bwl/pwo/kliewer/forschung/Projekte/RAPADO/index.html">
              <img id="nav_logo" src={require("./assets/rapado_logo.png")} alt="logo" />
            </a>

            <NavLink to="/Home" activeClassName="active-link">Your Parts and Certificates</NavLink>
            <NavLink to="/ShowCertificate" activeClassName="active-link">Show Certificate</NavLink>
            <NavLink to="/Cards" activeClassName="active-link">New Certificate</NavLink>
            <NavLink id="disabledLink" to="/Validation" className={this.state.disabled} activeClassName="active-link">Validation</NavLink>

            <ul className="navbar-nav px-3">
              <li id="ul_account" className="nav-item text-nowrap">
                  <span className="text-white" id="account">Your address: {this.state.accounts[0]}</span>
              </li>
            </ul>

          </nav>

          <div className="content">
            <Switch>
              <Route exact path="/"><Home onSubmitValidateAirCraftPart={this.onSubmitValidateAirCraftPart} getListOfParts={this.getListOfParts} onSubmitAirCraftPart={this.onSubmitAirCraftPart} /></Route>
              <Route exact path="/Home"><Home state={this.state} getListOfParts={this.getListOfParts} onSubmitAirCraftPart={this.onSubmitAirCraftPart} /></Route>
              <Route exact path="/Cards"><Cards /></Route>
              <Route exact path="/UploadCertificate"><UploadCertificate state={this.state} captureCertificate={this.captureCertificate} addCertificate={this.addCertificate} fetch={this.ipfsDownload} /></Route>
              <Route exact path="/FormOne"><FormOne onSubmitAddCertificate={this.onSubmitAddCertificate} /></Route>
              <Route exact path="/Ata"><Ata onSubmitAddCertificate={this.onSubmitAddCertificate} /></Route>
              <Route exact path="/ShowCertificate"><ShowCertificate getKey={this.getKey} ipfsDownload={this.ipfsDownload} /></Route>
              <Route exact path="/Validation"><Validation state={this.state} onSubmitValidateAirCraftPart={this.onSubmitValidateAirCraftPart} getListOfAllParts={this.getListOfAllParts} /></Route>
            </Switch>

          </div>

        </div>
      </Router>
    );
  }
}

export default App;
