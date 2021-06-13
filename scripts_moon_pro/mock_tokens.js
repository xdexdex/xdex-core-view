const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

  const accounts = await ethers.getSigners();
  const feeAdrr = hre.network.config.attachs.fee;
  console.log("fee to :",feeAdrr);
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  // 0x5Da8ba9eb90596f972804368f0565D561f7176ec
  // 
  symbols =  ["AAA","BBB","CCC","DDD"];
  names = ["DDEX AAA Token Test","DDEX BBB Token Test","DDEX CCC Token Test","DDEX DDD Token Test"];
  for(let i = 0;i<symbols.length;i++) {
    token = await ERC20Template.deploy(accounts[0].address,accounts[0].address,names[i],symbols[i],18);
    await token.deployed();
    console.log(symbols[i]," deployed to:", token.address);
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