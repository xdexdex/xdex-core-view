const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
const feeAdrr = hre.network.config.attachs.fee;
console.log("fee to :",feeAdrr);
  const attachs = hre.network.config.attachs;
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
 
  usdt = await ERC20Template.attach(attachs.usdt);
  console.log("usdt attach to:", usdt.address);

  const DDX = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDX.attach(attachs.ddx);
  console.log("ddx attach to:", ddx.address);

  
  const Repurchase = await hre.ethers.getContractFactory("Repurchase");
  const repurchase = await Repurchase.deploy(2000,"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await repurchase.deployed();
  console.log("repurchase deployed to:", repurchase.address);
  await repurchase.addCaller(accounts[0].address);
  console.log("repurchase addCaller to:", accounts[0].address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attachs.uniswap.factory);
  console.log("factory attache to:", factory.address);
  const s = await factory.setRepurchaseTo(repurchase.address);
  console.log("factory setRepurchaseTo to:", repurchase.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });