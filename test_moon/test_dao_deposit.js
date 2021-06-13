

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');
const { assert } = require("console");


async function main() {
  /** 准备 start */
  const attach =  hre.network.config.attachs;
  const accounts = await ethers.getSigners();

  //DDXPool
  const RaiseDAO = await hre.ethers.getContractFactory("RaiseDAO");
  // let raisedaodynamic = await RaiseDAO.deploy();
  let raisedaodynamic = await RaiseDAO.attach(attach.raisedaodynamic);
  console.log("raisedaodynamic attach to:", raisedaodynamic.address);
  // let raisedaodynamic = await RaiseDAO.deploy();
  let raisedaofix7 = await RaiseDAO.attach(attach.raisedaofix7);
  console.log("raisedaofix7 attach to:", raisedaofix7.address);
  let raisedaofix14 = await RaiseDAO.attach(attach.raisedaofix14);
  console.log("raisedaofix14 attach to:", raisedaofix14.address);
  let raisedaofix30 = await RaiseDAO.attach(attach.raisedaofix30);
  console.log("raisedaofix30 attach to:", raisedaofix30.address);
  let raisedaofix60 = await RaiseDAO.attach(attach.raisedaofix60);
  console.log("raisedaofix60 attach to:", raisedaofix60.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  //HT
  const WHT = await hre.ethers.getContractFactory("WHT");
  const wht = await WHT.attach(attach.wht);
  console.log("wht attached to:", wht.address);
  //HUSD
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
  const husd = await HUSD.attach(attach.husd);
  console.log("HUSD attached to:", husd.address);
  //HBTC
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const hbtc = await ERC20Template.attach(attach.hbtc);
  console.log("hbtc attach to:", hbtc.address);
  //HETH
  const heth = await ERC20Template.attach(attach.heth);
  console.log("heth attach to:", heth.address);
  //HLTC
  const hltc = await ERC20Template.attach(attach.hltc);
  console.log("hltc attach to:", hltc.address);
  //HDOT
  const hdot = await ERC20Template.attach(attach.hdot);
  console.log("hdot attach to:", hdot.address);
  /** 准备 end */

  //奖励金额 相关后端提供
  //_offeringAmount - for(0->currentReleaseIdx) sum (releaseAmount)
  
  // raisedaofix = raisedaofix7;
  // raisedaofix = raisedaofix14;
  // raisedaofix = raisedaofix30;
  raisedaofix = raisedaofix60;
  //查询用户存入金额（staked）
  userInfo = await raisedaofix.userInfo(accounts[0].address);
  console.log("raisedaofix userInfo to:", userInfo.toString());

  let releasePeroidsLength = await raisedaodynamic.getReleaseLength();
  for(let pid = 0;pid<releasePeroidsLength;pid++) {
    const getReleaseInfo = await raisedaodynamic.getReleaseInfo(pid);
    console.log(pid,"raisedaodynamic getReleaseInfo:", getReleaseInfo.toString())
  }
  console.log("ddx balanceOf :" ,(await ddx.balanceOf(accounts[0].address)).toString());
  const amountDeposit = ethers.utils.parseUnits("1000",await ddx.decimals()); 

  console.log("approve:",await ddx.approve(raisedaodynamic.address,amountDeposit));
  let allowu = await ddx.allowance(accounts[0].address,raisedaodynamic.address);
  console.log("raisedaodynamic ddx allowu :",allowu.toString());
  let deposit = await raisedaodynamic.deposit(amountDeposit);
  console.log("raisedaodynamic deposit :",deposit);

  // await ddx.approve(raisedaofix7.address,amountDeposit);
  // allowu = await ddx.allowance(accounts[0].address,raisedaofix7.address);
  // console.log("raisedaofix7 ddx allowu :",allowu.toString());
  // deposit = await raisedaofix7.deposit(amountDeposit);
  // console.log("raisedaofix7 deposit :",deposit);

  // await ddx.approve(raisedaofix14.address,amountDeposit);
  // allowu = await ddx.allowance(accounts[0].address,raisedaofix14.address);
  // console.log("raisedaofix14 ddx allowu :",allowu.toString());
  // deposit = await raisedaofix14.deposit(amountDeposit);
  // console.log("raisedaofix14 deposit :",deposit);

  // await ddx.approve(raisedaofix30.address,amountDeposit);
  // allowu = await ddx.allowance(accounts[0].address,raisedaofix30.address);
  // console.log("raisedaofix30 ddx allowu :",allowu.toString());
  // deposit = await raisedaofix30.deposit(amountDeposit);
  // console.log("raisedaofix30 deposit :",deposit);

  // await ddx.approve(raisedaofix60.address,amountDeposit);
  // allowu = await ddx.allowance(accounts[0].address,raisedaofix60.address);
  // console.log("raisedaofix60 ddx allowu :",allowu.toString());
  // deposit = await raisedaofix60.deposit(amountDeposit);
  // console.log("raisedaofix60 deposit :",deposit);
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
