

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
  //SwapMining
  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  const swapmining = await SwapMining.attach(attach.swapmining);
  console.log("swapmining attach to:", swapmining.address);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  /** 准备 end */

  
  // console.log("setDDXPerBlock:",await swapmining.setDDXPerBlock(ethers.utils.parseUnits("66",18)));

  console.log("ddxPerBlock:",(await swapmining.ddxPerBlock()).toString());

  //查询当前用户交易挖矿信息（前端可不关注）
  const poolLength = await swapmining.poolLength();
  console.log(" poolLength",poolLength.toString());
  for( let pid =0 ;pid<poolLength;pid++) {
    let poolInfo = await swapmining.poolInfo(pid);
    console.log(pid," poolInfo",poolInfo.toString());
    console.log(pid,"pair：",poolInfo.pair);
    const pair = await UniswapV2Pair.attach(poolInfo.pair);
    const token0 = await ERC20Template.attach(await pair.token0());
    const token1 = await ERC20Template.attach(await pair.token1());
    console.log(pid,"token0/token1:",await token0.symbol(),"/",await token1.symbol());
    // const balancePair = await pair.balanceOf(accounts[0].address);
    // console.log("balancePair:",balancePair.toString());
    // //查询是否存在
    let userInfo = await swapmining.userInfo(pid, accounts[0].address);
    console.log("userInfo:",userInfo.toString());
    // if(userInfo.quantity.gt("0")) {//存在
    //   taker = true;
    //   console.log("pid",pid,"userInfo amount gt 0");
    // }
  }


  //查询收益
  let getTakerReward = await swapmining.getTakerReward(accounts[0].address);
  console.log("getTakerReward:",getTakerReward.toString());
  if(getTakerReward.gt("0")) {
    //提现
    const withdraw = await swapmining.takerWithdraw();
    console.log("withdraw:",withdraw);
  }
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
