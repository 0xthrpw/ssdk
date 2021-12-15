const ethers = require('ethers');
const Web3 = require('web3');
const opensea = require('opensea-js');

let seaport, union, clientAPI;

let NULL_BLOCK_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

exports = module.exports = {};

exports.test = function(a) {
  return `[test] ${a}`;
}

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

exports.assignOrdersToSides = function assignOrdersToSides(order, matchingOrder) {
    var isSellOrder = order.side == 1;
    var buy;
    var sell;
    if (!isSellOrder) {
        buy = order;
        sell = __assign({}, matchingOrder, { v: buy.v, r: buy.r, s: buy.s });
    }
    else {
        sell = order;
        buy = __assign({}, matchingOrder, { v: sell.v, r: sell.r, s: sell.s });
    }
    return { buy: buy, sell: sell };
}

// opensea: export to plugin
exports.createSeaPort = async function(provider, network, apiKey) {
  let config = {
    networkName: network,
    apiKey: apiKey
  }
  // if(network == opensea.Network.Main){
  //   config.apiKey = apiKey;
  // }
  this.seaport = new opensea.OpenSeaPort(provider, config);
  return this.seaport;
}

exports.getAsset = async function(tokenAddress, tokenId){
  const asset = await this.seaport.api.getAsset({
    tokenAddress: tokenAddress,
    tokenId: tokenId
  });
  return asset;
};

exports.buyAsset = async function(market, order){

  try{
    const transactionHash = await this.seaport.fulfillOrder({ order: order, accountAddress})
    console.log("transactionHash", accountAddress)
  } catch( error) {
    await dispatch('alert/error', error, { root: true });
    console.log("error", error)
  }
};

exports.ethers = ethers;
exports.Web3 = Web3;
exports.opensea = opensea;
exports.seaport = this.seaport;
