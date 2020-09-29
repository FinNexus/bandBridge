let Web3 = require("Web3")
const fs = require('fs');
let collateral0 = "0x0000000000000000000000000000000000000000";
let web3 = new Web3(new Web3.providers.HttpProvider("https://demodex.wandevs.org:48545"));
let IBandOracleAggregator = require("../build/contracts/IBandOracleAggregator.json");
async function rinkebyQuery(){
    let oracle = await new web3.eth.Contract(IBandOracleAggregator.abi,"0x5eDeB71eD96F716ea769Ca9EAe9552fc112320a3");
    let price = await oracle.methods.getReferenceData(['BTC/USD', 'ETH/USD', 'WAN/USD', 'FNX/USD']).call();
    console.log("BTC Price :",price);
}

rinkebyQuery();