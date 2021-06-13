

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
  //Repurchase
  const Repurchase = await hre.ethers.getContractFactory("Repurchase");
  const repurchase = await Repurchase.attach(attach.repurchase);
  console.log("repurchase attach to:", repurchase.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  /** 准备 end */

  //（非前端功能）添加流动性代币，抵押流动性代币，抵押DDX

 
  //获取代币：流动性代币合约pair:husd/wht
    //
  // console.log("setAmountIn:",await repurchase.setAmountIn(ethers.utils.parseUnits("1000")));
  const swapV = await repurchase.swapV();
  console.log("swapV:",swapV);
  const swap = await repurchase.swap();
  console.log("swap:",swap);
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
