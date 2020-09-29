let Web3 = require("Web3")
const fs = require('fs');
let collateral0 = "0x0000000000000000000000000000000000000000";
let web3 = new Web3(new Web3.providers.HttpProvider("https://demodex.wandevs.org:48545"));
let BandOracle = require("../build/contracts/BandOracle.json");
async function rinkebyQuery(){
    let oracle = await new web3.eth.Contract(BandOracle.abi,"0x7c7925309baf18c24603926343d376282068f604");
    let btcPrice = await oracle.methods.getUnderlyingPrice(1).call();
    console.log("btcPrice :",btcPrice.toString(10));
    let ethPrice = await oracle.methods.getUnderlyingPrice(2).call();
    console.log("ethPrice :",ethPrice.toString(10));
    let result = await oracle.methods.getPrice("0xB8E944024180B4a51234a7ea65f5D73AC64e69e4").call();
    console.log("fnx price :",result.toString(10));
    return;


    result = await oracle.methods.getPrice(collateral0).call();
    console.log("wan price :",result.toString(10));
}

rinkebyQuery();