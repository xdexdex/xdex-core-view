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
console.log("refers attach to:",await factory.refers());

const Oracle = await hre.ethers.getContractFactory("Oracle");
const oracle = await Oracle.deploy(factory.address,1800);
await oracle.deployed();
console.log("oracle deployed to:", oracle.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });