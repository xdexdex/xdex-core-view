

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  //SwapMining
  const SwapMining = await hre.ethers.getContractFactory("SwapMining");
  const swapmining = await SwapMining.attach(attach.swapmining);
  console.log("swapmining attach to:", swapmining.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);

  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  
  //HT
  
  /** 准备 end */
  var pairs = ["0xa00cd6c69defdc1ba240d9d44924d49179e3a601"];

  var points = [10,10,20,30]
  for(let i = 0;i<pairs.length;i++) {
    pairAddr = pairs[i];
    console.log(i,"pair:",pairAddr);
        
    const pair = await UniswapV2Pair.attach(pairAddr);
    const token0 = await ERC20Template.attach(await pair.token0());
    const token1 = await ERC20Template.attach(await pair.token1());
    console.log(i,"token0/token1:",await token0.symbol(),"/",await token1.symbol());
    const pairId = await swapmining.pairOfPid(pairAddr);
    console.log("pairId:",pairId);
    // "WHT / USDT"
    if(pairId>0) {
      console.log("pairAddr: exist");
      continue;
    }
    console.log("swapmining addPair:",await swapmining.addPair(points[i], pairAddr, true));
    // let addWhitelist = await swapmining.addWhitelist(token0.address);
    // console.log("addWhitelist token0:",addWhitelist)
    // addWhitelist = await swapmining.addWhitelist(token1.address);
    // console.log("addWhitelist token1:",addWhitelist)
    // console.log("addLp:",addLp);
    // //查询pid
   
  }
  // //添加流动性代币（非前端）：DDXToken
  poolLength = await swapmining.poolLength();
  console.log("poolLength:",poolLength);
  const poolInfo = await swapmining.poolInfo(0);
  console.log("poolInfo:",poolInfo);
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
