const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");



async function main() {

const accounts = await ethers.getSigners();
  const attachs = hre.network.config.attachs;
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const DDXRouter = await hre.ethers.getContractFactory("DDXRouter");
  const router = await DDXRouter.attach(attachs.uniswap.router);
  console.log("router attach to:", router.address);

  let addrs = [
    // "0xe7a7fa605aa6e3c74604c9c6dde86e72e23477e4",
    // "0xAE91d4163eB72AC55965436a30Acad26D3a0A68c",
    // "0xf0830E1a28Df63F8f688EF45d7C00E2E7B0fE37c",
    // "0x3A33D60eb3b58b8C79fC3D9Fa1650C6406eA01DD",
    // "0x36951ba817Fea7373df6BbaA89499C60A3E5FEf3",
    // "0xC18f3F15aa3c72A3592D281941d6dAaCF4769bE6",
    "0x84bb4F9ab48dfE463423fB80f56670EEFE20eef8",
    // "0xe7A7Fa605Aa6E3c74604c9C6DDE86E72E23477e4",
    // "0x85271Fbe7758BDE41b732BC994dFF813adf1066D"
  ];
  let tokenAmount = "2000000";

  tokens = [
        "0x3FB9ff40B3783370a43E383818ED8871598BeA44",
        "0x410787af2871D0c18A74065CA35e860ee66f8A35",
        "0xCA55A6c422D93f42087B635faC014f7946DEeF5d",
        "0x9902DDb630D9528d5BdAFac5e6a78BC1181fDD70",
      ];
  
  for(i = 0;i<addrs.length;i++) {
    for(j = 0;j<tokens.length;j++) {
      let tokenA = await ERC20Template.attach(tokens[j]);
      symbol = await tokenA.symbol();
      // if(symbol=="HUSD" ||symbol=="USDT" ) {
      //   console.log(symbol," mint ....");
      //   if(symbol=="HUSD"){
      //     const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");
      //     tokenA = await HUSD.attach(tokens[j])
      //     await tokenA.issue(addrs[i],ethers.utils.parseUnits(tokenAmount,await tokenA.decimals()));
      //   } else {
      //     await tokenA.mint(addrs[i],ethers.utils.parseUnits(tokenAmount,await tokenA.decimals()));
      //   }
        
      // } else{
        console.log(await tokenA.symbol()," mint ....");
        await tokenA.mint(addrs[i],ethers.utils.parseUnits(tokenAmount,await tokenA.decimals()));
        
      // }
      // console.log("tokenA approve is:",await tokenA.approve(router.address,ethers.utils.parseUnits("9999999999999999",await tokenA.decimals())));
     
      
      
    }

    // await accounts.sendTransaction({to:addrs[i],value:ethers.utils.parseUnits("200000")});
    // console.log("send eth .....");
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });