

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attachs =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  const TokenLock = await hre.ethers.getContractFactory("TokenLock");
  const tokenLock = await TokenLock.attach(attachs.tokenlock);
  // await tokenLock.deployed();
  console.log("tokenLock attach to:", tokenLock.address);
  /** 准备 end */

  //查询当前总资产（锁仓+释放）
  const totalSupply = await tokenLock.totalSupply();
  console.log("totalSupply:",totalSupply.toString());

  //查询当前用户资产
  const balanceOf = await tokenLock.balanceOf(accounts[0].address);
  console.log("balanceOf:",balanceOf.toString());
  //查询待领取
  let getUnlock = await tokenLock.getUnlock(accounts[0].address);
  console.log("getUnlock:",getUnlock.toString());
  if(getUnlock.gt("0")) {
    //提取收益
    const getReward = await tokenLock.getReward(accounts[0].address);
    console.log("getReward:",getReward);
  }
  
  

}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
