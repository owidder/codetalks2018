var HashStore = artifacts.require("./HashStore.sol");

module.exports = function(deployer) {
  deployer.deploy(HashStore);
};
