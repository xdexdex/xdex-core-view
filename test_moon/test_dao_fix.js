

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
const { pid } = require("process");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  const DDXDao = await hre.ethers.getContractFactory("DDXDao");

  let ddxdao7 = await DDXDao.attach(attach.ddxdao7);
  console.log("ddxdao7 attach to:", ddxdao7.address);
  let ddxdao14 = await DDXDao.attach(attach.ddxdao14);
  console.log("ddxdao14 attach to:", ddxdao14.address);
  let ddxdao30 = await DDXDao.attach(attach.ddxdao30);
  console.log("ddxdao30 attach to:", ddxdao30.address);
  let ddxdao60 = await DDXDao.attach(attach.ddxdao60);
  console.log("ddxdao60 attach to:", ddxdao60.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  /** 准备 end */

  //奖励金额 相关后端提供
  //_offeringAmount - for(0->currentReleaseIdx) sum (releaseAmount)

  ddxdao = ddxdao7;
  // ddxdao = ddxdao14;
  // ddxdao = ddxdao30;
  // ddxdao = ddxdao60;
  //查询存入金额（Total Locked）
  totalSupply = await ddxdao.totalSupply();
  console.log("ddxdao totalSupply to:", totalSupply.toString());

  //查询用户存入金额（Your Locked）
  balanceOf = await ddxdao.balanceOf(accounts[0].address);
  console.log("ddxdao balanceOf to:", balanceOf.toString());

  const amountDeposit = ethers.utils.parseUnits("1000",await ddx.decimals()); 
  //存入
    //授权
  await ddx.approve(ddxdao.address,amountDeposit);
    //查询授权限额
  allowu = await ddx.allowance(accounts[0].address,ddxdao.address);
  console.log("ddxdao ddx allowu :",allowu.toString());
    //存入
  // deposit = await ddxdao.deposit(amountDeposit);
  // console.log("ddxdao deposit :",deposit);

  //判断是否到期
  canWithdraw = await ddxdao.canWithdraw(accounts[0].address);
  console.log("ddxdao canWithdraw :",canWithdraw);
  if(canWithdraw == 1) {//可取回
    // 取回部分
    withdraw = await ddxdao.withdraw(amountDeposit);
    console.log("ddxdao withdraw :",withdraw);
    // 取回所有
    withdraw = await ddxdao.withdrawAll();
    console.log("ddxdao withdrawAll :",withdraw);
  }
 

  
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
