

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
  raisedaofix = raisedaofix30;
  // raisedaofix = raisedaofix60;
  //查询用户存入金额（staked）
  userInfo = await raisedaofix.userInfo(accounts[0].address);
  console.log("raisedaofix userInfo to:", userInfo.toString());

  //查询用户奖励金额（earned）
  // let getUserCurrentRlease = await raisedaodynamic.getUserCurrentRlease(accounts[0].address);
  // console.log("raisedaodynamic getUserCurrentRlease to:", getUserCurrentRlease);

  const amountDeposit = ethers.utils.parseUnits("1000",await ddx.decimals()); 
  //质押
    //授权
  await ddx.approve(raisedaofix.address,amountDeposit);
    //查询授权限额
  allowu = await ddx.allowance(accounts[0].address,raisedaofix.address);
  console.log("raisedaofix ddx allowu :",allowu.toString());
    //质押
  // deposit = await raisedaofix.deposit(amountDeposit);
  // console.log("raisedaofix deposit :",deposit);

  //查询是否可收获
    //查询块号
  let blockNumber = await ethers.provider.getBlockNumber();
  console.log("blockNumber:",blockNumber);
    //查询endBlock
  endBlock = await raisedaofix.endBlock();
  if(blockNumber < endBlock || userInfo.amount == 0){ //未到收获时间 或者 未存入金额
    
  } else { 
    const getReleaseInfo = await raisedaofix.getReleaseInfo(0);
    console.log(0,"raisedaofix getReleaseInfo:", getReleaseInfo.toString());
    //查询当前收益（定期的不可撤出领取）
    console.log("raisedaofix getOfferingAmount :",await raisedaofix.getOfferingAmount(accounts[0].address));
    //查询当前收益（定期的不可撤出领取）
    // console.log("raisedaofix getOfferingAmount :",await raisedaofix.getOfferingAmount(getReleaseInfo._endBlock,accounts[0].address));
  
  }

  //查询活期 pid： 0(30天), 1(60天)
  let releasePeroidsLength = await raisedaodynamic.getReleaseLength();
  for(let pid = 0;pid<releasePeroidsLength;pid++) {
    const getReleaseInfo = await raisedaodynamic.getReleaseInfo(pid);
    console.log(pid,"raisedaodynamic getReleaseInfo:", getReleaseInfo.toString())
  }
  //查询当前收益（定期的不可撤出领取）
  console.log("raisedaodynamic getOfferingAmount current :",await raisedaodynamic.getOfferingAmount(accounts[0].address));
  //查询到期预估收益
  // console.log("raisedaodynamic getOfferingAmount end:",pid,await raisedaodynamic.getOfferingAmount(getReleaseInfo._endBlock,accounts[0].address));

  //   收获
  harvest = await raisedaofix.harvest();
  console.log("raisedaofix harvest :",harvest);
  
  
  
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
