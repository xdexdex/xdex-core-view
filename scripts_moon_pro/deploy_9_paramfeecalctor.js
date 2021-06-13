const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");

var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");


async function main() {

  const accounts = await ethers.getSigners();
  const attachs = hre.network.config.attachs;

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
  console.log("factory attach to:", factory.address);

  const ParamFeeCalctor = await hre.ethers.getContractFactory("ParamFeeCalctor");
  const paramFeeCalctor = await ParamFeeCalctor.deploy(factory.address);
  await paramFeeCalctor.deployed();
  console.log("paramfeecalctor deploy to:", paramFeeCalctor.address);
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });