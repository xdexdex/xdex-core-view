

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

   //DDXRouter
   const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
   const router = await DDXRouter.attach(attach.uniswap.router);
   console.log("router attach to:", router.address);
  //DDXPool
  const DDXPool = await hre.ethers.getContractFactory("DDXPool");
  const ddxpool = await DDXPool.attach(attach.ddxpool);
  console.log("ddxpool attach to:", ddxpool.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  
  /** 准备 end */

  //选择流动性代币pid(pid由后端提供);
  // let pid=0; //举例pid=0
  //获取DDX pid
  // let pid = (await ddxpool.LpOfPid(ddx.address)).toString();
  let pid = "0";
  //查询pid对应的poolInfo信息
  let poolInfo = await ddxpool.poolInfo(pid);
  console.log(pid," poolInfo",poolInfo);
  //查询用户LP 代币余额
  const pair = await UniswapV2Pair.attach(poolInfo.lpToken);
  const balancePair = await pair.balanceOf(accounts[0].address);
  console.log("balancePair:",balancePair.toString());

  //查询是否存在抵押
  let userInfo = await ddxpool.userInfo(pid, accounts[0].address);
  console.log("userInfo:",userInfo);
  if(userInfo.amount.lte("0")) {//不存在
    console.log("userInfo amount eq rewardDebt");
  }
  //查询收益
  let pending = await ddxpool.pending(pid, accounts[0].address);
  pending = pending[0];
  console.log("pending:",pending);
  if(pending.gt("0")) {
    //领取收益
    let withdraw = await ddxpool.withdraw(pid, 0);
    console.log("withdraw reward:",withdraw);
  }
  //设置抵押金额
  const amountDeposit = balancePair.div(2);
  console.log("amountDeposit:",amountDeposit.toString());
  //授权
  console.log("pair.approve ...:",await pair.approve(ddxpool.address,amountDeposit));
  //查询授权限额
  let allowu = await pair.allowance(accounts[0].address,ddxpool.address);
  console.log("lp allowu is:", allowu.toString());

  //抵押
  const deposit = await ddxpool.deposit(pid, amountDeposit,accounts[0].address);
  console.log("deposit:",deposit);

  //查询抵押池子信息
  poolInfo = await ddxpool.poolInfo(pid);
  console.log(pid," poolInfo",poolInfo);
  //查询用户抵押信息
  userInfo = await ddxpool.userInfo(pid, accounts[0].address);
  console.log("userInfo:",userInfo);
  
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
