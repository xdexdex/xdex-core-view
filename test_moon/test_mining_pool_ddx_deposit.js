

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
  
  /** 准备 end */

  //（非前端功能）添加流动性代币，抵押流动性代币，抵押DDX

 
  //获取代币：流动性代币合约pair:husd/wht
  console.log("router.factory:", await router.factory());
  const poolLength = await ddxpool.poolLength();
  console.log("poolLength:",poolLength);
  const pid = await ddxpool.LpOfPid(ddx.address);
  console.log("pid:",pid.toString());
  const poolInfo = await ddxpool.poolInfo(pid);
  console.log("poolInfo:",poolInfo.toString());

  const balancePair = await ddx.balanceOf(accounts[0].address);
  console.log("balancePair:",balancePair.toString());
    //添加流动性代币（非前端）
    // uint256 _allocPoint, 权重
    //  IERC20 _lpToken, 代币地址
    //  bool _withUpdate 是否更新
  const amountDeposit = balancePair.div(2);
  console.log("amountDeposit:",amountDeposit.toString());
  //授权
  await ddx.approve(ddxpool.address,amountDeposit);
  const allowu = await ddx.allowance(accounts[0].address,ddxpool.address);
  console.log("ddx allowu is:", allowu.toString());

  const deposit = await ddxpool.deposit(pid.toString(), amountDeposit,accounts[0].address);
  console.log("deposit:",deposit);
    //查询pid
  
  //添加流动性代币（非前端）：DDXToken
  const userInfo = await ddxpool.userInfo(pid, accounts[0].address);
  console.log("userInfo:",userInfo.toString());
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
