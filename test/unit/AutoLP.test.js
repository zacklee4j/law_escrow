const {ethers} = require('hardhat');
const {expect} = require('chai');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {parseEther } = require('ethers');

describe("AutoLP Contract Tests", function () {
    let AutoLP;
  let autoLP;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  
  // 测试用的 ERC20 代币
  let TestToken;
  let testToken;
  
  // Uniswap V2 Router 地址 (使用 Hardhat 本地网络上的模拟地址)
  const UNI_ROUTER_ADDR = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const WETH_TOKEN_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  before(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    // 部署测试用的 ERC20 代币
    TestToken = await ethers.getContractFactory("ERC20Mock");
    testToken = await TestToken.deploy("Test Token", "TTK", owner.address, parseEther("1000000"));
    console.log(1);
    // 部署 AutoLP 合约
    AutoLP = await ethers.getContractFactory("AutoLP");
    console.log(2);
    autoLP = await AutoLP.deploy(testToken.getAddress());
    console.log(3);
    // 给合约发送一些测试代币
    await testToken.transfer(autoLP.address, parseEther("1000"));
  });

  describe("部署", function () {
    it("应该正确设置代币地址", async function () {
      expect(await autoLP.tokenAddr()).to.equal(testToken.address);
    });
    
    it("应该正确设置 Uniswap Router", async function () {
      // 这里可以添加检查 Router 设置的测试
    });
  });
})