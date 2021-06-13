const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

 /** 准备 start */
 const attachs =  hre.network.config.attachs;
 const accounts = await ethers.getSigners();

  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attachs.uniswap.router);
  console.log("router attach to:", router.address);
 //DDX
 const DDXToken = await hre.ethers.getContractFactory("DDXToken");
 const ddx = await DDXToken.attach(attachs.ddx);
 console.log("ddx attach to:", ddx.address);
 //usdt
 const USDT = await hre.ethers.getContractFactory("ERC20Template");
 const usdt = await USDT.attach(attachs.usdt);
 console.log("usdt attached to:", usdt.address);
 /** 准备 end */

const DDXFeeCollector = await hre.ethers.getContractFactory("DDXFeeCollector");
const feeCollector = await DDXFeeCollector.attach(attachs.feecollector);
// const feeCollector = await DDXFeeCollector.deploy(ddx.address,accounts[1].address);

console.log("DDXFeeCollector attach to:", feeCollector.address);
// await ddx.setFeeCollector(feeCollector.address);
// feeCollector.addWhitelist(attachs.router);
const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);

const Oracle = await hre.ethers.getContractFactory("Oracle");
const oracle = await Oracle.attach(attachs.oracle);
// await oracle.deployed();
console.log("oracle attach to:", oracle.address);

const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenLock = await TokenLock.attach(attachs.tokenlock);
// await tokenLock.deployed();
console.log("tokenLock attach to:", tokenLock.address);
// /**
//  * IDDX _ddx,
//       IUniswapV2Factory _factory,
//       IOracle _oracle,
//       address _router,
//       address _targetToken,
//       uint256 _ddxPerBlock,
//       uint256 _startBlock,
//       address _tokenLock
//  */
const SwapMining = await hre.ethers.getContractFactory("SwapMining");
const blockNumber = await ethers.provider.getBlockNumber();
console.log("blockNumber:",blockNumber);
const swapMining = await SwapMining.deploy(ddx.address,factory.address,oracle.address,router.address,usdt.address,ethers.utils.parseEther("52.6","ether"),blockNumber+30,tokenLock.address);
// const swapMining = await SwapMining.attach(attachs.swapmining);
await swapMining.deployed();
console.log("swapMining deployed to:", swapMining.address);
const router_swapMining = await router.setSwapMing(swapMining.address);
console.log("router setSwapMing to:",await router.swapMining());

// const DDXPool = await hre.ethers.getContractFactory("DDXPool");
// var amount = web3.utils.toWei('110','ether');
// var blocknumber = await ethers.provider.getBlockNumber();
// var hourblocks = 25/5;
// // const ddxPool = await DDXPool.deploy(ddx.address,amount,blocknumber + hourblocks,1576800);
// // await ddxPool.deployed();
// const ddxPool = await DDXPool.attach(attachs.ddxpool);
// console.log("ddxPool deployed to:", ddxPool.address);
// const addMinter = await ddx.addMinter(ddxPool.address);
// console.log("ddx addMinter to:", ddxPool.address);

const addMinter = await ddx.addMinter(swapMining.address);
console.log("ddx addMinter to:", swapMining.address);

const tokenlock = await swapMining.setTokenLock(attachs.tokenlock);
console.log("swapMining setTokenLock to:", attachs.tokenlock);

//  console.log("balanceOf ", (await usdt.balanceOf("0x0d9aaBe8A606071FCe70413e5D2E94eDe8f7C1B6")).toString());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });