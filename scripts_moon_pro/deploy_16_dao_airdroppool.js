const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();

const attachs = hre.network.config.attachs;

const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);

const AirdropPool = await hre.ethers.getContractFactory("AirdropPool");
// address _bonusToken,
// uint256 _cycle
const airdroppool = await AirdropPool.deploy(ddx.address,30*24*60*12);
await airdroppool.deployed();
console.log("airdroppool deployed to:", airdroppool.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });