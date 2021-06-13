

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");

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
  // const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  // const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  // console.log("factory attached to:", factory.address);

  //DDXRouter
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attach.uniswap.router);
  console.log("router attach to:", router.address);
  //HT
  const WHT = await hre.ethers.getContractFactory("WHT");
  const wht = await WHT.attach(attach.wht);
  console.log("wht attached to:", wht.address);
  //HUSD
  // const HUSD = await hre.ethers.getContractFactory("ERC20Template");
  
  const HUSD = await hre.ethers.getContractFactory("ERC20Template");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);

  //设置amountHusd
  const amount = "3000000";
  const amountHusd = ethers.utils.parseUnits(amount,await husd.decimals());
  let  amountWHT = ethers.utils.parseUnits("1000000",await wht.decimals());;
  // const amountWHT = ethers.utils.parseUnits("1000");
  const balance = await husd.balanceOf(accounts[0].address);
  console.log("HUSD.balance=:",balance);
  if(balance.lt(amountHusd)) {
    console.log("husd.issue=:",await husd.mint(accounts[0].address,amountHusd));
  }
  assert(balance.gt(amountHusd),"HUSD balance is insufficient for ",amountHusd)
  
  //设置amountWHT
  // const HTReservers = await router.getHTReservers(husd.address);
  // console.log("router getHTReservers (tokenA,tokenB)=",HTReservers);
  
  // if(HTReservers[0].eq(0)) {
  //    amountWHT = ethers.utils.parseUnits(amount,await husd.decimals());;
  // }
  // amountWHT = await router.quote(amountHusd, HTReservers[0],  HTReservers[1]);
  console.log("router quote amountWHT =",amountWHT);
  
  const htbalance = await ethers.provider.getBalance(accounts[0].address)
  console.log("HT balance :", htbalance);
  assert(htbalance.gt(amountWHT),"HUSD balance is insufficient for ",amountWHT)

  //Husd授权router : Approve
  await husd.approve(router.address,amountHusd);
  const allowu = await husd.allowance(accounts[0].address,router.address);
  console.log("husd allowu is:", allowu);
  assert(allowu.eq(amountHusd),"husd allowu for router is insufficient for ",amountHusd)
  
  //添加流动性：addLiquidityHT
  const liquid = await router.addLiquidityHT(husd.address,amountHusd.toString(),0,0,accounts[0].address,1629969715533,{value:amountWHT.toString(),from:accounts[0].address});
  console.log("router addLiquidityHT liquid=",liquid);

  //查询币对池金额：getHTReservers
  const getHTReservers = await router.getHTReservers(husd.address);
  console.log("router getHTReservers (tokenA,tokenB)=",getHTReservers);

  //查询流动性代币：getHTReservers
  const getHTPair = await router.getHTPair(husd.address);
  console.log("router getHTPair =",getHTPair);
  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const pair = await UniswapV2Pair.attach(getHTPair);
  const pairLp = await pair.totalSupply();
  console.log("router getHTPairLp total=",pairLp);
  const pairLp1 = await pair.balanceOf(accounts[0].address);
  console.log("router getHTPairLp user=",pairLp1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
