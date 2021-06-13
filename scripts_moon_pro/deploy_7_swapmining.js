const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();
const attachs = hre.network.config.attachs;
const WHT = await hre.ethers.getContractFactory("WHT");
const wht = await WHT.attach(attachs.wht);
console.log("wht attach to:", wht.address);
const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
const usdt = await ERC20Template.attach(attachs.usdt);
console.log("usdt attach to:", usdt.address);

const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);

const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
console.log("factory attach to:", factory.address);

const UniswapV2Router02 = await hre.ethers.getContractFactory("DDXRouter");
const router = await UniswapV2Router02.attach(attachs.uniswap.router);
console.log("router attach to:", router.address);

const Oracle = await hre.ethers.getContractFactory("Oracle");
const oracle = await Oracle.attach(attachs.oracle);
console.log("oracle attach to:", oracle.address);

const TokenLock = await hre.ethers.getContractFactory("TokenLock");
const tokenlock = await TokenLock.attach(attachs.tokenlock);
console.log("tokenlock attach to:", tokenlock.address);

const SwapMining = await hre.ethers.getContractFactory("SwapMining");
/**
 * IDDX _ddx,
      IUniswapV2Factory _factory,
      IOracle _oracle,
      address _router,
      address _targetToken,
      uint256 _ddxPerBlock,
      uint256 _startBlock,
      address _tokenlock
 */
const _ddxPerBlock = ethers.utils.parseUnits("52.8");
const _startBlock = await ethers.provider.getBlockNumber()+(60*20);
console.log("_startBlock:",_startBlock);
const swapMining = await SwapMining.deploy(ddx.address,factory.address,oracle.address,router.address,usdt.address,_ddxPerBlock,_startBlock,tokenlock.address);
await swapMining.deployed();
console.log("swapMining deployed to:", swapMining.address);

const router_swapMining = await router.setSwapMing(swapMining.address);
console.log("router setSwapMing to:",await router.swapMining());
await swapMining.setTokenLock(tokenlock.address);
console.log("swapMining setTokenLock to:", tokenlock.address);

const addMinterswapMining = await ddx.addMinter(swapMining.address);
console.log("ddx addMinter to:", swapMining.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });