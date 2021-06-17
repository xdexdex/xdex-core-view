

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");
const { BigNumber } = require("@ethersproject/bignumber");
async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attach.uniswap.router);
  console.log("router attach to:", router.address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  //Oracle
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.attach(attach.oracle);
  console.log("oracle attach to:", oracle.address);

  const ParamFeeCalctor = await hre.ethers.getContractFactory("ParamFeeCalctor");
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const paramFeeCalctor = await ParamFeeCalctor.attach(attach.paramfeecalctor);
  console.log("paramFeeCalctor attach to:", paramFeeCalctor.address);
  //HBTC HRC20HUSD DDXToken
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");

  const hbtc = await ERC20Template.attach(attach.usdt);
  console.log("hbtc attached to:", hbtc.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("ERC20Template");
  const husd = await HUSD.attach(attach.bch);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  //选择币种HBTC,HUSD：查询HBTC余额,查询HUSD余额
  const htcbalance =await hbtc.balanceOf(accounts[0].address);
  const husdbalance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",husdbalance.toString());
  console.log("HBTC balance :", htcbalance.toString());
  
  //输入HBTC扣除数量
  const aount = "1";
  let amountInhbtc = ethers.utils.parseUnits(aount,await hbtc.decimals());
  let amountOutHusd = ethers.utils.parseUnits(aount,await husd.decimals());
  //计算HUSD到账数量：getAmountsOut(amountIn,[in地址,out地址])
  console.log("allPairsLength:",await factory.allPairsLength());
  pairAddress = await factory.getPair(hbtc.address,husd.address);
  pair = UniswapV2Pair.attach(pairAddress);
  console.log("pair:",pair.address);
  const getReserves = await pair.getReserves();
  console.log("getReserves:",getReserves.toString());
  if(hbtc.address>husd.address) {
    amountWInOut = await factory.getAmountOut(pairAddress,amountInhbtc, getReserves[1],getReserves[0]);
  } else {
    amountWInOut = await factory.getAmountOut(pairAddress,amountInhbtc, getReserves[0],getReserves[1]);
  }
  console.log("amountWInOut:",amountWInOut.toString());
   //  amountInhbtc = amountWInOut[0];//可不赋值
   amountOutHusd = amountWInOut;
   //展示价格
   // oracle.consult(husd.address,ethers.utils.parseUnits("1"),hbtc.address);
   const hbtc_price = amountOutHusd.mul(await hbtc.decimals()).div(amountInhbtc).div(await husd.decimals());
   console.log("hbtc_price =",hbtc_price.toString());
   //滑点1%：到账数量最少1-1%
   amountOutHusd = amountOutHusd.mul(99).div(100);

   if(htcbalance.lt(amountInhbtc)) {
     await hbtc.mint(accounts[0].address,amountInhbtc);
   }
   assert(htcbalance.gt(amountInhbtc),"hbtc余额不足")
   //Hbtc授权router : Approve
  await hbtc.approve(router.address,amountInhbtc);
  const allowu = await hbtc.allowance(accounts[0].address,router.address);
  console.log("hbtc allowu is:", allowu.toString());
  assert(allowu.eq(amountInhbtc),"hbtc授权router限额不足")
  
  // console.log("isFeeWhiteList :", await hbtc.isFeeWhitelist(router.address));
  // console.log("addFeeWhiteList :", await hbtc.addFeeWhitelist(router.address));
  // console.log("isFeeWhiteList :", await hbtc.isFeeWhitelist(router.address));

  //兑换
  //   uint amountIn,
  //   uint amountOutMin,
  //   address[] calldata path,
  //   address to,
  //   uint deadline
  const swap = await router.swapExactTokensForTokens(amountInhbtc,amountOutHusd,[hbtc.address,husd.address],accounts[0].address,1629969715533);
  // const swap = await router.swapExactTokensForTokens("1000000000","300000000000000",["0xb868Cc77A95a65F42611724AF05Aa2d3B6Ec05F2", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"] ,accounts[0].address,1629969715533);
  console.log("router swapExactTokensForTokens swap=",swap);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
