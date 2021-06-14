const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

  const accounts = await ethers.getSigners();
  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);
  const attachs = hre.network.config.attachs;
  const BonusPool = await hre.ethers.getContractFactory("BonusPool");
  const bonuspool = await BonusPool.deploy(feeAdrr);
  await bonuspool.deployed();
  console.log("bonuspool deploy to:", bonuspool.address);
  
  let poolInfo = await bonuspool.addCaller(accounts[0].address);
  console.log("bonuspool addCaller to",accounts[0].address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });