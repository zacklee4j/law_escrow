const {ethers} = require('hardhat');
const {expect} = require('chai');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {parseEther,toUtf8String } = require('ethers');
const UniswapV2Factory = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapV2Router02 = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const WETH9 = require('@uniswap/v2-periphery/build/WETH9.json');
describe("AutoLP Contract Tests", function () {
  
  async function deployAutoLPFixture() {
    const [owner, user1] = await ethers.getSigners();

    // 1. 部署WETH9合约
    
    const WETH = await ethers.getContractFactory(
      WETH9.abi,
      WETH9.bytecode
    );
    const weth = await WETH.deploy();
    const wethAddress = await weth.getAddress();
    // 2. 部署测试代币
    const TestToken = await ethers.getContractFactory("ERC20Mock");
    const testToken = await TestToken.deploy(
      "TestToken", 
      "TTK", 
      owner.address, 
      parseEther("1000000")
    );
    const tokenAddress = await testToken.getAddress();
    console.log(tokenAddress);
    // 3. 部署UniswapV2工厂合约
    const Factory = await ethers.getContractFactory(
      UniswapV2Factory.abi,
      UniswapV2Factory.bytecode
    );
    const factory = await Factory.deploy(owner.address);
    const factoryAddress = await factory.getAddress();
    // 4. 创建代币-WETH交易对
    console.log(tokenAddress, wethAddress);
    await factory.createPair(tokenAddress, wethAddress);
    const pairAddress = await factory.getPair(tokenAddress, wethAddress);

    // 5. 部署Router02合约(需先获取Pair合约的initCodeHash)
    const Router = await ethers.getContractFactory(
      UniswapV2Router02.abi,
      UniswapV2Router02.bytecode
    );
    const router = await Router.deploy(factoryAddress, wethAddress);
    //const routerAddress = await router.getAddress();
    // 6. 部署AutoLP合约
    try {
      const AutoLP = await ethers.getContractFactory("AutoLP");
      const autoLP = await AutoLP.deploy(tokenAddress);
      console.log("AutoLP deployed to:", await autoLP.getAddress());
      
    } catch (error) {
    console.error("Deployment failed:", error);
    if (error.data) {
        console.log("Revert reason:", toUtf8String(error.data));
      }
    }
    const autoLPAddress = await autoLP.getAddress();
    // 7.准备测试环境
    await testToken.transfer(autoLPAddress, parseEther("1000"));
    await weth.deposit({ value: parseEther("10") });
    await weth.transfer(autoLPAddress, parseEther("5"));

    return { 
      autoLP,
      testToken, 
      weth, 
      factory, 
      router, 
      owner, 
      user1,
      pairAddress
    };
  }

  describe("部署", function () {
    it("应该正确设置代币地址", async function () {
      
      const { autoLP,testToken } = await loadFixture(deployAutoLPFixture);
      
      expect(await autoLP.tokenAddr()).to.equal(await testToken.getAddress());
      
    });
    
    it("应该正确设置 Uniswap Router", async function () {
      const { autoLP,testToken } = await loadFixture(deployAutoLPFixture);
      // 这里可以添加检查 Router 设置的测试
    });
  });
})