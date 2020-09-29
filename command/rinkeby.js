let Web3 = require("Web3")
const fs = require('fs');
let collateral0 = "0x0000000000000000000000000000000000000000";
let web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/f977681c79004fad87aa00da8f003597"));
let FNXOracle = require("../build/contracts/FNXOracle.json");
let ImpliedVolatility = require("../build/contracts/ImpliedVolatility.json");
let daySeconds = 24*3600;
async function rinkebyQuery(){
    let oracle = await new web3.eth.Contract(FNXOracle.abi,"0x950812ac76fACF39236dBD87dBe388bc96a3B311");
    let price = await oracle.methods.getUnderlyingPrice(1).call();
    console.log("BTC Price :",price.toString(10));
    price = await oracle.methods.getUnderlyingPrice(2).call();
    console.log("ETH Price :",price.toString(10));
    price = await oracle.methods.getPrice("0xc69a38684D6Db1beaB5029093B1d19CE7595f130").call();
    console.log("USDC Price :",price.toString(10));
    price = await oracle.methods.getPrice(collateral0).call();
    console.log("ETH Price :",price.toString(10));
    price = await oracle.methods.getPrice("0xB642Cef1cffD9cCEa0e6724887b722B27A3E7D23").call();
    console.log("FNX Price :",price.toString(10));
    let iv = await new web3.eth.Contract(ImpliedVolatility.abi,"0x1771fbfe6d3dfa1a7882cf712910dcfd41a3e216");

}
async function calculateIv(volInstance,expiration,curprice,strikePrice){
    let iv = await volInstance.methods.calculateIv(1,0,expiration,curprice,strikePrice).call();
    console.log(iv[0]/iv[1]);
}
rinkebyQuery();