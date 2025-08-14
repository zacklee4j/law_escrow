const {ethers} = require("hardhat");
const {expect} = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


describe("DealStamp合约测试", () => {
    async function deployDealStmpFixture(){
        const [owner,user1 ] = await ethers.getSigners();
        const DealStamp = await ethers.getContractFactory("DealStamp");
        const ds = await DealStamp.deploy();
        return {owner,user1,ds}
    }

    it("新增交易stamp成功",async () => {
        const {owner,user1,ds} = await loadFixture(deployDealStmpFixture);
        //console.log("---->",await ds.getAddress());
        const salt = "0x1234"; // 测试salt
    //     const packed = ethers.solidityPacked(
    //       ["address", "bytes"],
    //       [owner.address, salt]
    //   );
        // const hash = ethers.keccak256(packed);
        const blockNum = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNum);
        const timestamp = block.timestamp;

        await expect(ds.connect(owner).newDealStamp(salt,timestamp,owner.address,user1.address)).to.emit(ds,"DealStamped").withArgs(0,timestamp,salt,[owner.address,user1.address]);
    })

});