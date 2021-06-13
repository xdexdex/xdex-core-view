

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  //DDXPool
  const AirdropPool = await hre.ethers.getContractFactory("AirdropPool");
  let airdroppool = await AirdropPool.attach(attach.airdroppool);
  console.log("airdroppool attach to:", airdroppool.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  /** 准备 end */

  //奖励金额 相关后端提供

  //添加（非前端）
  // console.log("airdroppool add ",await airdroppool.add(10, ddx.address, true));
  //创建活期奖励
  let blockNumber = await ethers.provider.getBlockNumber();
  console.log("blockNumber:",blockNumber);  

  
  // const _tokenAmount = ethers.utils.parseUnits("1000000",await ddx.decimals());
  // //授权
  // await ddx.approve(airdroppool.address,_tokenAmount);
  //   //查询授权限额
  // allowu = await ddx.allowance(accounts[0].address,airdroppool.address);
  // console.log("newAirdrop ddx allowu :",allowu.toString());
  // let newAirdrop = await airdroppool.newAirdrop(_tokenAmount,ethers.utils.parseUnits("0.1",await ddx.decimals()),blockNumber+10);
  // console.log("newAirdrop:",newAirdrop);


  pid = 0;
  //查询用户存入金额（staked）
  userInfo = await airdroppool.userInfo(pid,accounts[0].address);
  console.log("airdroppool userInfo to:", userInfo.toString());
  const amountDeposit = ethers.utils.parseUnits("1000",await ddx.decimals());
  //质押
    //授权
  await ddx.approve(airdroppool.address,amountDeposit);
    //查询授权限额
  allowu = await ddx.allowance(accounts[0].address,airdroppool.address);
  console.log("airdroppool ddx allowu :",allowu.toString());
    //质押
  // deposit = await airdroppool.deposit(pid,amountDeposit);
  // console.log("airdroppool deposit :",deposit);

 //查询用户奖励金额（earned）
  let reward = await airdroppool.pending(pid,accounts[0].address);
  console.log("airdroppool reward to:", reward);

  if(reward.gt(0)) {//大于0
    //提取收益
    // const withdrawReward = await airdroppool.withdraw(pid,0);
    // console.log("airdroppool withdrawReward to:", withdrawReward);
  }
  
  //提取流动性和收益
  const withdrawReward = await airdroppool.withdraw(pid,userInfo.amount);
  console.log("airdroppool withdrawReward to:", withdrawReward);
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
