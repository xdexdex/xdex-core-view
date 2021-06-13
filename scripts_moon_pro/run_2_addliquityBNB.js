

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");
const { ContractFactory } = require("@ethersproject/contracts");

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
  const WHT = await hre.ethers.getContractFactory("WHT");
  const wht = await WHT.attach(attach.wht);
  console.log("wht attached to:", wht.address);
  //Token
  // const Token = await hre.ethers.getContractFactory("ERC20Template");
  
  const Token = await hre.ethers.getContractFactory("ERC20Template");
  const token = await Token.attach(attach.usdt);
  console.log("Token attached to:", token.address);

  //设置amountHusd
  const amount = "35400000";
  const amountToken = ethers.utils.parseUnits(amount,await token.decimals());
  let  amountWHT = ethers.utils.parseUnits("100000",await wht.decimals());;
  // const amountWHT = ethers.utils.parseUnits("1000");
  const balance = await token.balanceOf(accounts[0].address);
  console.log("Token.balance=:",balance);
  if(balance.lt(amountToken)) {
    console.log("token.issue=:",await token.mint(accounts[0].address,amountToken));
  }
  assert(balance.gt(amountToken),"Token balance is insufficient for ",amountToken)
  
  //设置amountWHT
  let getPair = await factory.getPair(token.address,wht.address);
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
      if(token0 != token.address) {
        reserveTokenA =  getReserve[1]
        reserveTokenB =  getReserve[0]
      }
      if(getReserve[0].eq(0)) {
        amountB = amountA;
      }
      amountWHT = await router.quote(amountToken, reserveTokenA,  reserveTokenB);
    }
    
  }
  console.log("router quote amountB =",amountWHT);
  
  const htbalance = await ethers.provider.getBalance(accounts[0].address)
  console.log("HT balance :", htbalance);
  assert(htbalance.gt(amountWHT),"Token balance is insufficient for ",amountWHT)

  //Husd授权router : Approve
  await token.approve(router.address,amountToken);
  
  let allowu = await token.allowance(accounts[0].address,router.address);
  console.log("token allowu is:", allowu);
  while (allowu.lt(amountToken)) {
    allowu = await token.allowance(accounts[0].address,router.address);
    console.log("token allowu is:", allowu);
  }
  assert(allowu.eq(amountToken),"token allowu for router is insufficient for ",amountToken)
  
  //添加流动性：addLiquidityHT
  // address token,
  // uint amountTokenDesired,
  // uint amountTokenMin,
  // uint amountHTMin,
  // address to,
  // uint deadline
  const liquid = await router.addLiquidityHT(token.address,amountToken.toString(),0,0,accounts[0].address,1629969715533,{value:amountWHT.toString(),from:accounts[0].address});
  console.log("router addLiquidityHT liquid=",liquid);

  //查询币对池金额：getReserves
  getPair = await factory.getPair(token.address,wht.address);
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
