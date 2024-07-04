require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // localhost: {
    //   chainId: 1337,
    //   url: "http://127.0.0.1:8545/",
    // },
    // hardhat: {
    //   loggingEnabled: true, // Enable detailed logging
    //   // other configurations
    // },
  },
};
