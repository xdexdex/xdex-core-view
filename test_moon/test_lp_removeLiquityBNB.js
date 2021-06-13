

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
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);

  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  //点击流动性币对：查询流动性余额，流动性占比，锚定币对量
  //获取流动性代币合约pair
  let getPair = await factory.getPair(husd.address,attach.wht);
  console.log("factory.getPair ", getPair)
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const pair = await UniswapV2Pair.attach(getPair);
  console.log("pair:",pair.address);

  //查询币种名称：
  const token0 = await pair.token0();
  const token1 = await pair.token1();
  //缓存获取币种名称：
  console.log("token0:",token0);
  console.log("token1:",token1);

  //查询用户流动性余额
  let lp_balance = await pair.balanceOf(accounts[0].address);
  console.log("lp_balance:",lp_balance);

  //授权router流动性限额
  lp_balance = lp_balance.div(10);
  console.log("approve:",await pair.approve(router.address,lp_balance));
  const lp_allowance = await pair.allowance(accounts[0].address,router.address);
  console.log("router lp_allowance:",lp_allowance);

  //撤出流动性
  // address token,
  // uint liquidity,
  // uint amountTokenMin,
  // uint amountHTMin,
  // address to,
  // uint deadline
  const removeLiquidity = await router.removeLiquidityHT(husd.address,lp_allowance,0,0,accounts[0].address,1629969715533);
  console.log("removeLiquidity:",removeLiquidity);

  //查询池子币对量
  const reserves = await pair.getReserves();
  console.log("reserves:",reserves);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
