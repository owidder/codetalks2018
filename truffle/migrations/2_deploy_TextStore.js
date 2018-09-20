var TextStore = artifacts.require("./TextStore.sol");

module.exports = function(deployer) {
  deployer.deploy(TextStore);
};
