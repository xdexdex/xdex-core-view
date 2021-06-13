const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");

var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();
const attachs = hre.network.config.attachs;

const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);

const DDXFeeCollector = await hre.ethers.getContractFactory("DDXFeeCollector");
const feeCollector = await DDXFeeCollector.deploy(ddx.address,accounts[0].address);
await feeCollector.deployed();
console.log("DDXFeeCollector deployed to:", feeCollector.address);
await ddx.setFeeCollector(feeCollector.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });