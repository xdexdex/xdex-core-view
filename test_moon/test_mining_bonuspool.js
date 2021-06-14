

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);

  //BonusPool
  const BonusPool = await hre.ethers.getContractFactory("BonusPool");
  const bonuspool = await BonusPool.attach(attach.bonuspool);
  console.log("bonuspool attach to:", bonuspool.address);

  //查询pid对应的poolInfo信息
  // let poolInfo = await bonuspool.addCaller(accounts[0].address);
  // console.log("bonuspool addCaller to",accounts[0].address);

  console.log("pair:",await factory.getPair(attach.usdt,attach.bch));

  await bonuspool.emergencyWithdraw(attach.fee,pair);
  console.log("bonuspool emergencyWithdraw to",attach.fee,pair);
  
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
