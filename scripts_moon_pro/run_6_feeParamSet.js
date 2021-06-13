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
  const paramFeeCalctor = await ParamFeeCalctor.attach(attachs.paramfeecalctor);
  // const paramFeeCalctor = await ParamFeeCalctor.attach(attachs.paramfeecalctor);
  console.log("paramfeecalctor attach to:", paramFeeCalctor.address);
  
  // uint256  feeTotal;
  // uint256  feeBase;
  // uint256  sita;
  // uint256  repurchase;

  //BTC/USDT: 0.25 : AMM:0.2 Platform:0.05(1/5) Repurchase:1/5 [feeTotal=9975,feeBase=10000,sita=40000,repurchase=2000]
  // let pairAddress = await factory.getPair(attachs.bch, attachs.usdt);
  // console.log("getPair：",pairAddress);
  // await factory.setPairCalculator(pairAddress,paramFeeCalctor.address);
  // console.log("factory setPairCalculator to:", paramFeeCalctor.address);
  // console.log("paramFeeCalctor.setPairParams:",await paramFeeCalctor.setPairParams(pairAddress,9975,10000,40000,5000));

  let pairAddress = await factory.getPair(attachs.bch, attachs.usdt);
  console.log("getPair：",pairAddress);
  if(pairAddress>"0x0") {
    await factory.setPairCalculator(pairAddress,paramFeeCalctor.address);
    console.log("factory setPairCalculator to:", paramFeeCalctor.address);
    console.log("paramFeeCalctor.setPairParams:",await paramFeeCalctor.setPairParams(pairAddress,9945,10000,100000,5000));
  }
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });