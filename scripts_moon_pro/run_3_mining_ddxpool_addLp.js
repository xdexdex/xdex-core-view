

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  //DDXPool
  const DDXPool = await hre.ethers.getContractFactory("DDXPool");
  const ddxpool = await DDXPool.attach(attach.ddxpool);
  console.log("ddxpool attach to:", ddxpool.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
 
  /** 准备 end */
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  var pairs = ["0x1f27d8192175286a4883b66e7cdf3bf6ead183bb",
  "0x4b10fe613a1e135a1b2ccc767425c56136503819",
  "0x63826c7ef53f47b5d868b729d5df30b8c6e4285c",
  "0x8f379cfba8fa14ec042605eca3f08830e74a075b"];

  var points = [10,10,20,30]
  for(let i = 0;i<pairs.length;i++) {
    pair = pairs[i];
    console.log("pair:",pair);
    //添加流动性代币（非前端）
    // uint256 _allocPoint, 权重
    //  IERC20 _lpToken, 代币地址
    //  bool _withUpdate 是否更新
    //查询pid
    const pairId = await ddxpool.LpOfPid(pair);
    console.log("pairId:",pairId);
    if(pairId!=0) {
        continue;
    }
    // const addLp = await ddxpool.add(points[i], pair, true);
    // console.log("addLp:",addLp);
    
    const pairLp = await UniswapV2Pair.attach(pair);
    const token0 = await ERC20Template.attach(await pairLp.token0());
    const token1 = await ERC20Template.attach(await pairLp.token1());
    console.log(i,"token0/token1:",await token0.symbol(),"/",await token1.symbol());
  }
  // //添加流动性代币（非前端）：DDXToken
  // const addDDX = await ddxpool.add(20, ddx.address, true);
  // console.log("addDDX:",addDDX);
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
