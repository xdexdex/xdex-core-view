const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
const web3 = require('web3');
var Assert = require('assert');

async function main() {

const accounts = await ethers.getSigners();
//  for (const account of accounts) {
//      const balance = await ethers.provider.getBalance(account.address);

//     console.log(account.address+",balance="+balance);
//   }
const attachs = hre.network.config.attachs;
const WHT = await hre.ethers.getContractFactory("WHT");
const wht = await WHT.attach(attachs.wht);
console.log("wht attach to:", wht.address);

const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
const busd = await HUSD.attach(attachs.husd);
console.log("busd attach to:", busd.address);

const DDXToken = await hre.ethers.getContractFactory("DDXToken");
const ddx = await DDXToken.attach(attachs.ddx);
console.log("ddx attach to:", ddx.address);

// constructor(
//   string memory __name,
//   uint256 _lockTime,
//   address _depositToken,
//   address _governance,
//   address chef
// )
const DDXDao = await hre.ethers.getContractFactory("DDXDao");
let ddxdao = await DDXDao.deploy("DDX DAO-7",7*24*60*12,ddx.address,accounts[0].address,accounts[0].address);
await ddxdao.deployed();
console.log("ddxdao7 deploy to:",ddxdao.address);
ddxdao = await DDXDao.deploy("DDX DAO-14",14*24*60*12,ddx.address,accounts[0].address,accounts[0].address);
await ddxdao.deployed();
console.log("ddxdao14 deploy to:",ddxdao.address);
ddxdao = await DDXDao.deploy("DDX DAO-30",30*24*60*12,ddx.address,accounts[0].address,accounts[0].address);
await ddxdao.deployed();
console.log("ddxdao30 deploy to:",ddxdao.address);
ddxdao = await DDXDao.deploy("DDX DAO-60",60*24*60*12,ddx.address,accounts[0].address,accounts[0].address);
await ddxdao.deployed();
console.log("ddxdao60 deploy to:",ddxdao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });