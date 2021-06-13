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
const WHT = await hre.ethers.getContractFactory("WHT");
const wht = await WHT.attach(attachs.wht);
console.log("wht attach to:", wht.address);

const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);

const UniswapV2Router02 = await hre.ethers.getContractFactory("DDXRouter");
const router = await UniswapV2Router02.deploy(factory.address,wht.address);
await router.deployed();
console.log("router deployed to:", router.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });