const ethers = require('ethers');
const Web3 = require('web3');
const opensea = require('opensea-js');

let seaport, union, clientAPI;

exports = module.exports = {};

exports.test = function(a) {
  return `[test] ${a}`;
}

// opensea: export to plugin
exports.createSeaPort = async function(provider, network, apiKey) {
  let config = {
    networkName: network,
    apiKey: apiKey
  }
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

exports.getSellOffers = async function(tokenAddress, tokenId){
  const response = await this.seaport.api.getOrders({
    asset_contract_address: tokenAddress,
    token_id: tokenIds,
    side: 1
  });
  return response.orders;
}

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
//exports.seaport = this.seaport;
