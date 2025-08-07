const { ethers } = require("hardhat");
async function deployContract(name, args = [], options = {}) {
    const factory = await ethers.getContractFactory(name);
    return factory.deploy(...args, options);
  }
  
  async function getContractAt(name, address) {
    return ethers.getContractAt(name, address);
  }
  
  async function waitTx(tx) {
    return tx.wait();
  }
  
  module.exports = {
    deployContract,
    getContractAt,
    waitTx
  };