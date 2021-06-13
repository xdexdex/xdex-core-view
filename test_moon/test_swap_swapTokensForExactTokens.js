

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
  //Oracle
  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.attach(attach.oracle);
  console.log("oracle attach to:", oracle.address);

  //HBTC
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(attach.hbtc);
  console.log("attached to:", hbtc.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  /** 准备 end */

  //选择币种HBTC,HUSD：查询HBTC余额,查询HUSD余额
  const HBTCbalance = await ethers.provider.getBalance(accounts[0].address)
  const husdbalance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",husdbalance);
  console.log("HBTC balance :", HBTCbalance);
  
  //输入HBTC到账数量
  let amountOuthbtc = ethers.utils.parseUnits("10000");

  //计算HUSD扣除量: getAmountsIn(amountOut,[in地址,out地址])
   amountWInOut = await router.getAmountsIn(amountOuthbtc, [husd.address,hbtc.address]);
   amountInHusd = amountWInOut[0];//可不赋值
   amountOuthbtc = amountWInOut[1];
   //展示价格
   // oracle.consult(husd.address,ethers.utils.parseUnits("1"),hbtc.address);
   const hbtc_price = amountOuthbtc.mul(await husd.decimals()).div(amountInHusd).div(await hbtc.decimals());
   console.log("router hbtc_price =",hbtc_price);
   //滑点1%：扣除数量最多1+1%
   amountInHusd = amountInHusd.mul(101).div(100);;
   console.log("router getAmountsIn =",amountWInOut);
   assert(husdbalance.gt(amountOuthbtc),"husd余额不足")
   //Husd授权router : Approve
  await husd.approve(router.address,amountInHusd);
  const allowu = await husd.allowance(accounts[0].address,router.address);
  console.log("husd allowu is:", allowu);
  assert(allowu.eq(amountInHusd),"husd授权router限额不足")
  

  //兑换
  // uint amountOut,
    // uint amountInMax,
    // address[] calldata path,
    // address to,
    // uint deadline
  const swap = await router.swapTokensForExactTokens(amountOuthbtc,amountInHusd,[husd.address,hbtc.address],accounts[0].address,1629969715533);
  console.log("router swapTokensForExactTokens swap=",swap);


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
