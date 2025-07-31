const { ethers } = require("hardhat");
const {expect} = require("chai");
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");



describe("AccessByHash 合约测试",() =>{
  function stringToBytes32(str) {
    const buf = Buffer.alloc(32); // 32字节缓冲区
    const strBuf = Buffer.from(str, 'utf8');
    // 复制字符串内容，剩余部分补0
    strBuf.copy(buf, 0, 0, Math.min(strBuf.length, 32));
    return '0x' + buf.toString('hex');
  }
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
        const bytes32 = stringToBytes32("Hello World");
            await expect(abh.connect(owner).updateHashStatus(bytes32,true))
        await expect(abh.access(bytes32))
        .to.be
        .revertedWithCustomError(abh,"NotPermitted");
      });
    });
    
})