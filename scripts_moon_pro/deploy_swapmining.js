

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');

const web3 = require('web3');




async function main() {

  const addrs =  hre.network.config.attachs;

  const accounts = await ethers.getSigners();
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(addrs.ddx);
  Assert.equal("DDX",await ddx.symbol(),"DDXToken Contract Attach Error");
  console.log("DDX attached to:", ddx.address);
var provider = ethers.provider;

  const Oracle = await hre.ethers.getContractFactory("Oracle");
  const oracle = await Oracle.attach(addrs.oracle);
  console.log("Oracle attach to:", oracle.address);


  const TokenLock = await hre.ethers.getContractFactory("TokenLock");
  const tokenLock = await TokenLock.attach(addrs.ddx);
  console.log("TokenLock attach to:", tokenLock.address);

  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  var blocknumber = await provider.getBlockNumber();
  var hourblocks = 3600/5;

  const swapMining = await SwapMining.deploy(addrs.ddx,addrs.uniswap.factory,oracle.address,addrs.uniswap.router,addrs.usdt,110*6/10,blocknumber + hourblocks,tokenLock.address);
  await swapMining.deployed();
  console.log("SwapMining deploy to:", swapMining.address);


  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(addrs.uniswap.router);
  console.log("router attach to:", router.address);

  const router_swapMining = await router.setSwapMing(swapMining.address);
  console.log("router setSwapMing to:",await router.swapMining());
  const tokenlock = await swapMining.setTokenLock(tokenLock.address);
  console.log("swapMining setTokenLock to:", tokenLock.address);
  const addMinterswapMining = await ddx.addMinter(swapMining.address);
  console.log("ddx addMinter to:", swapMining.address);
  // await ddxpool.transferOwnership(addrs.owner);

  // const newowner = await ddxpool.owner();

  // console.log("DDXPool owner transfer from:%s to %s", owner,newowner);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
