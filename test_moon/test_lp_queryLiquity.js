

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

  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  //HT
  const WHT = await hre.ethers.getContractFactory("ERC20Template");
  const wht = await WHT.attach(attach.yfi);
  console.log("wht attached to:", wht.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("ERC20Template");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  //点击流动性币对：查询流动性余额，流动性占比，锚定币对量
  //获取流动性代币合约pair
  let getPair = await factory.getPair(husd.address,wht.address);
  console.log("factory.getPair ", getPair)
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const pair = await UniswapV2Pair.attach("0x2d04862e7b020289d799742fe76cf29ed5a60dc0");
  console.log("pair:",pair.address);

  //查询币种名称：
  const token0 = await ERC20Template.attach(await pair.token0());
  const token1 = await ERC20Template.attach(await pair.token1());
  console.log("token0/token1:",await token0.symbol(),"/",await token1.symbol());

  //查询用户流动性余额
  const lp_balance = await pair.balanceOf("0xe7A7Fa605Aa6E3c74604c9C6DDE86E72E23477e4");
  console.log("lp_balance:",lp_balance.toString());
  //查询流动性总额
  const lp_totalsupply = await pair.totalSupply();
  console.log("lp_totalsupply:",lp_totalsupply.toString());

  //计算流动性占比
  const lp_percent = lp_balance/lp_totalsupply;
  console.log("lp_percent:",lp_percent);

  
  //查询池子币对量
  const reserves = await pair.getReserves();
  console.log("reserves:",reserves.toString());
  //锚定token0的量：reserves[0]*lp_percent
  const token0Amount = reserves[0].mul(lp_totalsupply).div(lp_balance);
  console.log("token0 amount:",token0Amount.toString());
  //锚定token0的量：reserves[1]*lp_percent
  const token1Amount = reserves[1].mul(lp_totalsupply).div(lp_balance);
  console.log("token1 amount:",token1Amount.toString());

  let pid = await ddxpool.LpOfPid(pair.address);
  let poolInfo = await ddxpool.poolInfo(pid);
  console.log(pid.toString()," poolInfo",poolInfo.toString());

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
