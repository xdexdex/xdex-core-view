const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
const feeAdrr = hre.network.config.attachs.fee;
console.log("fee to :",feeAdrr);
  const attachs = hre.network.config.attachs;
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
 
  const usdt = await ERC20Template.attach(attachs.usdt);
  console.log("usdt attach to:", usdt.address);

  const DDX = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDX.attach(attachs.ddx);
  console.log("ddx attach to:", ddx.address);
  
  const References = await hre.ethers.getContractFactory("References");
  const references = await References.attach(attachs.references);
  console.log("references attach to:", references.address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const referRatio = "300";
  const factory = await UniswapV2Factory.deploy(feeAdrr,references.address,referRatio);
  await factory.deployed();
  console.log("factory deployed to:", factory.address);
  const pairCodeHash = await factory.pairCodeHash();
  console.log("factory pairCodeHash is:", pairCodeHash);
  await factory.setFeeTo(feeAdrr);
  console.log("factory fee to:", await factory.feeTo());
  console.log("factory init refers to:",await factory.refers());
  await references.addCaller(factory.address);
  console.log("references addCaller to",factory.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });