

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");

async function main() {
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);

  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attach.uniswap.router);
  console.log("router attach to:", router.address);
  
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  //tokenB
  const tokenB = await ERC20Template.attach(attach.aaa);
  console.log("tokenB attached to:", tokenB.address);
  //tokenA
  const tokenA = await ERC20Template.attach(attach.bbb);
  console.log("tokenA attached to:", tokenA.address);

  //设置amountTokenA
  const aount = "100000";
  const amountA = ethers.utils.parseUnits(aount,await tokenA.decimals());
  let amountB = ethers.utils.parseUnits("100000",await tokenB.decimals());
  const balance = await tokenA.balanceOf(accounts[0].address);
  console.log("tokenA.balance=:",balance);
  if(balance.lt(amountA)) {
    console.log("tokenA.issue=:",await tokenA.mint(accounts[0].address,amountA));
  }
  assert(balance.gt(amountA),"tokenA balance is insufficient for ",amountA)
  
  //设置amountB
    //查询pair是否存在
  let getPair = await factory.getPair(tokenA.address,tokenB.address);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  let pair = await UniswapV2Pair.attach(getPair);
  console.log("getPair :", getPair);
  if(parseInt(getPair,16) != 0) {
    const token0 = await pair.token0();
    let getReserve = await pair.getReserves();
    let reserveTokenA =  getReserve[0]
    let reserveTokenB =  getReserve[1]
    console.log("router getReserves (tokenA,tokenB)=",getReserve);
    if(getReserve[0]>0) {
      if(token0 != tokenA.address) {
        reserveTokenA =  getReserve[1]
        reserveTokenB =  getReserve[0]
      }
      if(getReserve[0].eq(0)) {
        amountB = amountA;
      }
      amountB = await router.quote(amountA, reserveTokenA,  reserveTokenB);
    }
    
  }
  console.log("router quote amountB =",amountB);

  const htbalance = await tokenB.balanceOf(accounts[0].address);
  console.log("TokenB.balance=:",htbalance);
  if(htbalance.lt(amountB)) {
    console.log("TokenB.mint=:",await tokenB.mint(accounts[0].address,amountB));
  }

  //TokenA授权router : Approve
  await tokenA.approve(router.address,amountA);
  await tokenB.approve(router.address,amountB);

  let allowu = await tokenA.allowance(accounts[0].address,router.address);
    console.log("tokenA allowu is:", allowu);
    while (allowu.lt(amountA)) {
      allowu = await tokenA.allowance(accounts[0].address,router.address);
      console.log("tokenA allowu is:", allowu);
    }

    let allowuB = await tokenB.allowance(accounts[0].address,router.address);
    console.log("tokenB allowu is:", allowuB);
    while (allowuB.lt(amountB)) {
      allowuB = await tokenB.allowance(accounts[0].address,router.address);
      console.log("tokenB allowu is:", allowuB);
    }


  
  //添加流动性：addLiquidityTokenB
  const liquid = await router.addLiquidity(tokenA.address,tokenB.address,amountA,amountB,0,0,accounts[0].address,1629969715533);
  console.log("router addLiquidity liquid=",liquid);

  //查询币对池金额：getReserves
  getPair = await factory.getPair(tokenA.address,tokenB.address);
  pair = await UniswapV2Pair.attach(getPair);
  getReserve = await pair.getReserves();
  console.log("router getReserves (tokenA,tokenB)=",getReserve);

  // 查询流动性代币：
  const pairLp = await pair.totalSupply();
  console.log("router lp total=",pairLp);
  const pairLp1 = await pair.balanceOf(accounts[0].address);
  console.log("router lp user=",pairLp1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
