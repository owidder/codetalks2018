var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "season divert corn exchange harbor book boat allow vivid error apple process";

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        infura: {
            provider: function () {
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/6b901e50131a4b69a46c6aad0294cb1d")
            },
            network_id: 4,
        },
    },
};
