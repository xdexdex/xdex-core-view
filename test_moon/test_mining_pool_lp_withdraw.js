

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
  //HT
  const WHT = await hre.ethers.getContractFactory("WHT");
  const wht = await WHT.attach(attach.wht);
  console.log("wht attached to:", wht.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  //HBTC
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(attach.hbtc);
  console.log("hbtc attach to:", hbtc.address);
  //HETH
  const heth = await ERC20Template.attach(attach.heth);
  console.log("heth attach to:", heth.address);
  //HLTC
  const hltc = await ERC20Template.attach(attach.hltc);
  console.log("hltc attach to:", hltc.address);
  //HDOT
  const hdot = await ERC20Template.attach(attach.hdot);
  console.log("hdot attach to:", hdot.address);
  /** 准备 end */


  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  console.log("router.factory:", await router.factory());
  const poolLength = await ddxpool.poolLength();
  let pid=0;
  let poolInfo = await ddxpool.poolInfo(pid);
  console.log(pid," poolInfo",poolInfo.toString());
  const pair = await UniswapV2Pair.attach(poolInfo.lpToken);
  const balancePair = await pair.balanceOf(accounts[0].address);
  console.log("balancePair:",balancePair.toString());

  //查询是否存在
  let userInfo = await ddxpool.userInfo(pid, accounts[0].address);
  console.log("userInfo:",userInfo.toString());
  //查询是否已抵押
  if(userInfo.amount.lte("0")) {
    console.log("userInfo amount eq rewardDebt");
    return ;
  }
  //查询是否有剩余收益
  let pending = await ddxpool.pending(pid, accounts[0].address);
  pending = pending[0];
  console.log("pending:",pending);
  if(pending.gt("0")) {
    //领取收益
    let withdraw = await ddxpool.withdraw(pid, 0);
    console.log("withdraw reward:",withdraw);
  }
  //撤出流动性代币
  const amountWithdraw = userInfo.amount/2;
  console.log("amountWithdraw:",amountWithdraw.toString());
  withdraw = await ddxpool.withdraw(pid, amountWithdraw.toString());
  console.log("withdraw lp:",withdraw);
  
  // poolInfo = await ddxpool.poolInfo(pid);
  // console.log(pid," poolInfo",poolInfo);
  //添加流动性代币（非前端）：DDXToken
  userInfo = await ddxpool.userInfo(pid, accounts[0].address);
  console.log("userInfo:",userInfo.toString());
  
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
