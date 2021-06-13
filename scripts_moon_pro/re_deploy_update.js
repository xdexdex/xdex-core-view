const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();

const attachs = hre.network.config.attachs;
//DDXToken
const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);
//UniswapV2Factory
const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);
//UniswapV2Router02
const UniswapV2Router02 = await hre.ethers.getContractFactory("DDXRouter");
const router = await UniswapV2Router02.attach(attachs.uniswap.router);
console.log("router attach to:", router.address);
//SwapMining
const SwapMining = await hre.ethers.getContractFactory("SwapMining");
const swapmining = await SwapMining.attach(attachs.swapmining);
console.log("swapmining attach to:", swapmining.address);
//DDXFeeCollector
const DDXFeeCollector = await hre.ethers.getContractFactory("DDXFeeCollector");
const feeCollector = await DDXFeeCollector.attach(attachs.feecollector);
console.log("feecollector attach to:", feeCollector.address);
//Oracle
const Oracle = await hre.ethers.getContractFactory("Oracle");
const oracle = await Oracle.attach(attachs.oracle);
console.log("oracle attach to:", oracle.address);
//TokenLock
const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenlock = await TokenLock.attach(attachs.tokenlock);
console.log("tokenlock attach to:", tokenlock.address);
//References
const References = await hre.ethers.getContractFactory("References");
const references = await References.attach(attachs.references);
console.log("references attach to:", references.address);
//DDXPool
const DDXPool = await hre.ethers.getContractFactory("DDXPool");
const ddxpool = await References.attach(attachs.ddxpool);
console.log("ddxpool attach to:", ddxpool.address);
//ParamFeeCalctor
const ParamFeeCalctor = await hre.ethers.getContractFactory("ParamFeeCalctor");
const paramFeeCalctor = await ParamFeeCalctor.attach(attachs.paramfeecalctor);
console.log("paramfeecalctor attach to:", paramFeeCalctor.address);

//Repurchase
const Repurchase = await hre.ethers.getContractFactory("Repurchase");
const repurchase = await Repurchase.attach(attach.repurchase);
console.log("repurchase attach to:", repurchase.address);

// ddx
console.log("addFeeWhiteList :", await ddx.addFeeWhitelist(router.address));
console.log("addFeeWhiteList factory:", await ddx.addFeeWhitelist(factory.address));
console.log("addFeeWhiteList refers:", await ddx.addFeeWhitelist(swapMining.address));
console.log("addFeeWhiteList refers:", await ddx.addFeeWhitelist(await factory.refers()));
await ddx.addMinter(swapmining.address);
console.log("ddx addMinter to swapmining:", swapmining.address);
await ddx.addMinter(ddxpool.address);
console.log("ddx addMinter to ddxpool:", ddxpool.address);

//pairCodeHash update 
//redeploy factory oracle

//factory 


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });