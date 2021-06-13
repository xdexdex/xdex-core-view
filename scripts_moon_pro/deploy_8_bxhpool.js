const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();
const attachs = hre.network.config.attachs;

const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);

const WHT = await hre.ethers.getContractFactory("WHT");
const wht = await WHT.attach(attachs.wht);
console.log("wht attach to:", wht.address);
const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
const usdt = await ERC20Template.attach(attachs.usdt);
console.log("usdt attach to:", usdt.address);

const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);

const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenLock = await TokenLock.attach(attachs.tokenlock);
console.log("tokenLock attach to:", tokenLock.address);


const DDXPool = await hre.ethers.getContractFactory("DDXPool");
// IDDX _ddx,
// uint256 _ddxPerBlock, //110
// uint256 _startBlock,
// uint256 _halvingPeriod,  //1576800,
// address _WToken,
// address _factory,
// address _tokenLock
const amount = ethers.utils.parseUnits("35.2");
const ddxPool = await DDXPool.deploy(ddx.address,amount,attachs.startblock,2592000,wht.address,factory.address,tokenLock.address);
await ddxPool.deployed();
console.log("ddxPool deployed to:", ddxPool.address);

await ddx.addMinter(ddxPool.address);
console.log("ddx addMinter to:", ddxPool.address);

await ddxPool.setTokenLock(tokenLock.address)
console.log("ddxPool setTokenLock to", tokenLock.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });