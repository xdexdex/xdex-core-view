

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
  //HT
  const WHT = await hre.ethers.getContractFactory("WHT");
  const wht = await WHT.attach(attach.wht);
  console.log("wht attached to:", wht.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  //选择币种HT,HUSD：查询HT余额,查询HUSD余额
  const htbalance = await ethers.provider.getBalance(accounts[0].address)
  const husdbalance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",husdbalance);
  console.log("HT balance :", htbalance);
  //输入HT扣除数量
  let amountInExactWHT = ethers.utils.parseUnits("1");
  assert(htbalance.gt(amountInExactWHT),"HT余额不足")
  //计算HUSD到账量:getAmountsOut(amountIn,[in地址,out地址])
   let amountWInOut = await router.getAmountsOut(amountInExactWHT, [wht.address,husd.address]);
   amountInExactWHT = amountWInOut[0];//可不赋值
   amountOutHusd = amountWInOut[1];
   //展示价格
   const husd_price = amountInExactWHT.mul(await husd.decimals()).div(amountOutHusd).div(await wht.decimals());
   console.log("husd_price =",husd_price);
   //滑点1%：到账数量至少99%
   amountOutHusd = amountOutHusd.mul(99).div(100);
   console.log("router getAmountsOut =",amountWInOut);
  

  //兑换
  // uint amountOut, 
  // address[] calldata path, 
  // address to, 
  // uint deadline
  const swap = await router.swapExactHTForTokens(amountOutHusd,[wht.address,husd.address],accounts[0].address,1629969715533,{value:amountInExactWHT});
  console.log("router swapExactHTForTokens swap=",swap);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
