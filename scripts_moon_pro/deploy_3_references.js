const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
const feeAdrr = hre.network.config.attachs.fee;
console.log("fee to :",feeAdrr);
  const attachs = hre.network.config.attachs;

  const TokenLock = await hre.ethers.getContractFactory("TokenLock");
  const tokenLock = await TokenLock.attach(attachs.tokenlock);
  console.log("tokenLock attach to:", tokenLock.address);

  const DDX = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDX.attach(attachs.ddx);
  console.log("ddx attach to:", ddx.address);

  
  const References = await hre.ethers.getContractFactory("References");
  const references = await References.deploy(ddx.address, attachs.sweeper,tokenLock.address);
  await references.deployed();
  console.log("references deployed to:", references.address);

  await references.initTable([66,33]);
  console.log("references initTable [66,33]");
  
  await references.setTokenLock(tokenLock.address)
  console.log("references setTokenLock to", tokenLock.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });