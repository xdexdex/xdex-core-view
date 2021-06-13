

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");

// const { expect } = require("chai");

// describe("Greeter", function() {
//   it("Should return the new greeting once it's changed", async function() {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
    
//     await greeter.deployed();
//     expect(await greeter.greet()).to.equal("Hello, world!");

//     await greeter.setGreeting("Hola, mundo!");
//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });


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
  //HT
  const WHT = await hre.ethers.getContractFactory("ERC20Template");
  const wht = await WHT.attach(attach.bch);
  console.log("wht attached to:", wht.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("ERC20Template");
  const husd = await HUSD.attach(attach.usdt);
  console.log("HUSD attached to:", husd.address);

  //设置amountHusd
  const aount = "10000000";
  const amountHusd = ethers.utils.parseUnits(aount,await husd.decimals());
  let amountWHT = ethers.utils.parseUnits("100000",await wht.decimals());
  const balance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",balance);
  if(balance.lt(amountHusd)) {
    console.log("husd.issue=:",await husd.mint(accounts[0].address,amountHusd));
  }
  assert(balance.gt(amountHusd),"HUSD balance is insufficient for ",amountHusd)
  
  //设置amountWHT
    //查询pair是否存在
  let getPair = await factory.getPair(husd.address,wht.address);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  let pair = await UniswapV2Pair.attach(getPair);
  console.log("getPair :", getPair);
  if(parseInt(getPair,16) != 0) {
    const token0 = await pair.token0();
    let getReserve = await pair.getReserves();
    let reserveHusd =  getReserve[0]
    let reserveWHT =  getReserve[1]
    console.log("router getReserves (tokenA,tokenB)=",getReserve);
    if(getReserve[0]>0) {
      if(token0 != husd.address) {
        reserveHusd =  getReserve[1]
        reserveWHT =  getReserve[0]
      }
      if(getReserve[0].eq(0)) {
        amountWHT = amountHusd;
      }
      amountWHT = await router.quote(amountHusd, reserveHusd,  reserveWHT);
    }
    
  }
  console.log("router quote amountWHT =",amountWHT);

  const htbalance = await wht.balanceOf(accounts[0].address);
  console.log("HT.balance=:",htbalance);
  if(htbalance.lt(amountWHT)) {
    console.log("HT.mint=:",await wht.mint(accounts[0].address,amountWHT));
  }

  //Husd授权router : Approve
  await husd.approve(router.address,amountHusd);
  const allowu = await husd.allowance(accounts[0].address,router.address);
  console.log("husd allowu is:", allowu);

  await wht.approve(router.address,amountWHT);
  const allowuHT = await wht.allowance(accounts[0].address,router.address);
  console.log("wht allowu is:", allowuHT);
  
  //添加流动性：addLiquidityHT
  const liquid = await router.addLiquidity(husd.address,wht.address,amountHusd,amountWHT,0,0,accounts[0].address,1629969715533);
  console.log("router addLiquidity liquid=",liquid);

  //查询币对池金额：getReserves
  getPair = await factory.getPair(husd.address,wht.address);
  pair = await UniswapV2Pair.attach(getPair);
  // getReserve = await pair.getReserves();
  // console.log("router getReserves (tokenA,tokenB)=",getReserve);

  //查询流动性代币：getReserves
  // const pairLp = await pair.totalSupply();
  // console.log("router lp total=",pairLp);
  // const pairLp1 = await pair.balanceOf(accounts[0].address);
  // console.log("router lp user=",pairLp1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
