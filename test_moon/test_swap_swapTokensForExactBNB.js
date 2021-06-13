

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
  for(i = 0;i<1000;i++) {
  //输入HT到账数量
  let amountOutExactWHT = ethers.utils.parseUnits("1");

  //计算HUSD扣除量：getAmountsIn(amountOut,[in地址,out地址])
   let amountWInOut = await router.getAmountsIn(amountOutExactWHT, [husd.address,wht.address]);
   amountInHusd = amountWInOut[0];
  //  amountOutExactWHT = amountWInOut[1];//可不赋值
   //展示价格
   const ht_price = amountInHusd.mul(await wht.decimals()).div(amountOutExactWHT).div(await husd.decimals());
   console.log("ht_price =",ht_price);
   //滑点1%：扣除数量最多1+1%
   amountInHusd = amountInHusd.mul(101).div(100);;
   console.log("router getAmountsIn =",amountWInOut);
   assert(husdbalance.gt(amountInHusd),"husd余额不足")
   
   assert(amountInHusd.lt(amountWInOut[0]),"EXCESSIVE_INPUT_AMOUNT")
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
  const swap = await router.swapTokensForExactHT(amountOutExactWHT,amountInHusd,[husd.address,wht.address],accounts[0].address,1629969715533);
  console.log("router swapExactHTForTokens swap=",swap);
  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
