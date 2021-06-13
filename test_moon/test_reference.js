

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
  //references
  const References = await hre.ethers.getContractFactory("References");
  const references = await References.attach(attach.references);
  console.log("references attach to:", references.address);
  //DDX
  const DDXToken = await hre.ethers.getContractFactory("DDXToken");
  const ddx = await DDXToken.attach(attach.ddx);
  console.log("ddx attach to:", ddx.address);
  //UniswapV2Factory
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.attach(attach.uniswap.factory);
  console.log("factory attached to:", factory.address);
  /** 准备 end */
  const pair = await factory.getPair(attach.bch,attach.usdt);
  console.log("pair:",pair)

  //查询被邀请地址及时间
  console.log(accounts[0].address,"0 userInfo:",await references.userInfo(accounts[0].address));
  //查询某个token的邀请收益 待定
  //
  //查询某个token的邀请收益 领取金额 待定
  
  //确认被邀请
  console.log("0 setReferee 5", await references.connect(accounts[0]).setReferee(accounts[5].address));
  console.log("5 setReferee 6", await references.connect(accounts[5]).setReferee(accounts[6].address));
  console.log(accounts[5].address,"5 userInfo:",await references.userInfo(accounts[5].address));
  //修改上级（管理员）
  // console.log("changeReferee:",await references.changeReferee(accounts[5].address,accounts[7].address));

  console.log(accounts[5].address,"5 userInfo:",await references.userInfo(accounts[5].address));
 
  //查询上级分润比例
  let rewardFeeRatio = await references.rewardFeeRatio(0);
  console.log("rewardFeeRatio 0:",rewardFeeRatio/100);
  //查询上上级分润比例
  rewardFeeRatio = await references.rewardFeeRatio(1);
  console.log("rewardFeeRatio 1:",rewardFeeRatio/100);

  //查询未领取邀请收益
  const layer1 = await references.pendingWithdraw(accounts[5].address,pair);
  console.log("layer1:", layer1.toString());
  const layer2 = await references.pendingWithdraw(accounts[6].address,pair);
  console.log("layer2:", layer2.toString());

}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
