require("@nomicfoundation/hardhat-toolbox");
const path = require('path');
// 路径别名配置（必须在任何其他导入之前）
require('module-alias').addAliases({
  '@utils': path.join(__dirname, 'src/utils')
});
module.exports = {
  solidity:  {compilers: [
    { version: "0.8.28" },  // 主版本
    { version: "0.5.16" },  // 兼容Chainlink等依赖
    { version: "0.6.6" }    // 旧版合约支持
  ]
},
  paths:{
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  node: {
    __dirname: true
  }
};
