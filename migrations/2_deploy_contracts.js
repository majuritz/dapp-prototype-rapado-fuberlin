var AirCraftPart = artifacts.require("./AirCraftPart.sol");

module.exports = function(deployer) {
  deployer.deploy(AirCraftPart);
};
