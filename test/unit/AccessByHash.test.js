const { ethers } = require("hardhat");
const {expect} = require("chai");
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {stringToBytes32} = require('@utils/datatype');
//const { toUtf8Bytes,keccak256 } =  require("ethers");

describe("AccessByHash 合约测试",() =>{
  
    async function deployTokenFixture(){
        const [owner,user1] = await ethers.getSigners();
        const ABH = await ethers.getContractFactory("AccessByHash");
        const abh = await ABH.deploy();
        return {abh, owner, user1}
    }

    describe("权限控制", () => {
        it("非owner无法更新hash状态", async () => {
            const {abh,owner,user1} = await loadFixture(deployTokenFixture);
            const bytes32 = stringToBytes32("Hello World");
            await expect(abh.connect(user1).updateHashStatus(bytes32,true))
            .to.be.revertedWithCustomError(abh,"NotOwner");
        });
        it("owner可以更新hash状态",async ()=>{
          const {abh,owner,user1} = await loadFixture(deployTokenFixture);
            const bytes32 = stringToBytes32("Hello World");
            await expect(abh.connect(owner).updateHashStatus(bytes32,true))
            .to.emit(abh,"HashChanged")
            .withArgs(bytes32,true);
        });
    });

    describe("访问控制", () => {
      it("无效hash无法访问", async () => {
        const {abh} = await loadFixture(deployTokenFixture);
        await expect(abh.access(stringToBytes32("salt")))
        .to.be
        .revertedWithCustomError(abh,"NotPermitted");
      });
      it("有效hash访问成功", async () => {
        const {abh,owner} = await loadFixture(deployTokenFixture);
        const salt = "0x1234"; // 测试salt
        //console.log("ABI编码:", ethers.AbiCoder.defaultAbiCoder().encode(["address", "bytes"], [owner.address, salt]));
        //console.log("Packed编码:", ethers.solidityPacked(["address", "bytes"], [owner.address, salt]));
        const packed = ethers.solidityPacked(
          ["address", "bytes"],
          [owner.address, salt]
      );
        const hash = ethers.keccak256(packed);
        // Check permission exists
        await expect(abh.connect(owner).updateHashStatus(hash,true))
        .to.emit(abh,"HashChanged")
        .withArgs(hash,true);
        // Check permission exists
        expect(await abh.permitted(hash)).to.equal(true);
        // Execute access function
        await abh.connect(owner).access(salt);
        // Verify accessed mapping was updated
        expect(await abh.accessed(owner.address)).to.equal(true);
      });
      
    });
    
})