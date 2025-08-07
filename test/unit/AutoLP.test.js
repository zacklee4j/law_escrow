const {ethers} = require('hardhat');
const {expect} = require('chai');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {parseEther } = require('ethers');

describe("AutoLP合约测试", () =>{
    async function deployTokenFixture(){
        const [owner,liquidityProvider] = await ethers.getSigners();
        // 部署模拟代币ERC20合约
        const Token = await ethers.getContractFactory("MockERC20");
        const token = await Token.deploy("Test Token", "TST");
        //await token.deployed();
        // 部署模拟路由器
        const Router = await ethers.getContractFactory("MockUniswapRouter");
        const router = Router.deploy();
        //await router.deployed();
        // 部署autoLP合约
        const AutoLP = await ethers.getContractFactory("AutoLP");
        const autolp = await AutoLP.deploy(
            (await router).getAddress,
            (await token).getAddress,
            (await owner).getAddress,
        );
        await token.transfer(autolp.address, parseEther("1000"));
        return {autolp,liquidityProvider,router,token, owner}
    };

    describe("流动性添加", () => {

        it("添加ETH流动性", async () => {
            const {autolp,liquidityProvider} = loadFixture(deployTokenFixture)
            const ethAmount = parseEther("1");
            await liquidityProvider.transfer({
                to:autolp.address,
                value: ethAmount
            })
            await expect(
                autolp.connect(owner).processLiquidityQueue()
            ).to.emit(autolp,"LiquidityProvided")
        })
    });
})