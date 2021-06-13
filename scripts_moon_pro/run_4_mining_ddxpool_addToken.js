

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

   //DDXRouter
   const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
   const router = await DDXRouter.attach(attach.uniswap.router);
   console.log("router attach to:", router.address);
  //DDXPool
  const DDXPool = await hre.ethers.getContractFactory("DDXPool");
  const ddxpool = await DDXPool.attach(attach.ddxpool);
  console.log("ddxpool attach to:", ddxpool.address);
  
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  
  tokens = ["0x20Dc424c5fa468CbB1c702308F0cC9c14DA2825C",
  "0x4653251486a57f90Ee89F9f34E098b9218659b83",
  "0x89ec9355b1Bcc964e576211c8B011BD709083f8d",
  "0x52bad4A8584909895C22bdEcf8DBF33314468Fb0"]
  
  /** 准备 end */
  for(let i = 0;i<tokens.length;i++) {
    // //添加流动性代币（非前端）：DDXToken
    const addDDX = await ddxpool.add(10, tokens[i], true);
    console.log("addDDX:",addDDX);
  }
  
  const poolLength = await ddxpool.poolLength();
  console.log("poolLength:",poolLength);
  const poolInfo = await ddxpool.poolInfo(0);
  console.log("poolInfo:",poolInfo);
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
