const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();
//  for (const account of accounts) {
//      const balance = await ethers.provider.getBalance(account.address);

//     console.log(account.address+",balance="+balance);
//   }
const attachs = hre.network.config.attachs;

const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);

const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);
console.log("refers attach to:",await factory.refers());
const UniswapV2Router02 = await hre.ethers.getContractFactory("DDXRouter");
const router = await UniswapV2Router02.attach(attachs.uniswap.router);
console.log("router attach to:", router.address);

const SwapMining = await hre.ethers.getContractFactory("SwapMining");
const swapMining = await SwapMining.attach(attachs.swapmining);
console.log("swapMining attach to:", swapMining.address);

const DDXPool = await hre.ethers.getContractFactory("DDXPool");
const ddxpool = await DDXPool.attach(attachs.ddxpool);
console.log("ddxpool attach to:", ddxpool.address);

const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenlock = await TokenLock.attach(attachs.tokenlock);
console.log("tokenlock attach to:", tokenlock.address);
// addFeeWhitelist
console.log("addFeeWhiteList :", await ddx.addFeeWhitelist(router.address));
console.log("addFeeWhiteList factory:", await ddx.addFeeWhitelist(factory.address));
console.log("addFeeWhiteList swapMining:", await ddx.addFeeWhitelist(swapMining.address));
console.log("addFeeWhiteList ddxpool:", await ddx.addFeeWhitelist(ddxpool.address));
console.log("addFeeWhiteList refers:", await ddx.addFeeWhitelist(await factory.refers()));
console.log("addFeeWhiteList tokenlock:", await ddx.addFeeWhitelist(tokenlock.address));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });