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

exports.atomicMatch = async function(order, accountAddress, referrerAddress = null){
  let matchingOrder = this.seaport._makeMatchingOrder({
      order: order,
      accountAddress: accountAddress.toLowerCase(),
      recipientAddress: accountAddress.toLowerCase() //"0x30306e0854f60244c4c7da0d0c05389715d78090"//
  });

  let result = this.assignOrdersToSides(order, matchingOrder);
  let buy = result.buy;
  buy.quantity = buy.quantity.toString();
  buy.makerRelayerFee = buy.makerRelayerFee.toString();
  buy.takerRelayerFee = buy.takerRelayerFee.toString();
  buy.makerProtocolFee = buy.makerProtocolFee.toString();
  buy.takerProtocolFee = buy.takerProtocolFee.toString();
  buy.makerReferrerFee = buy.makerReferrerFee.toString();
  buy.makerRelayerFee = buy.makerRelayerFee.toString();
  buy.basePrice = buy.basePrice.toString();
  buy.extra = buy.extra.toString();
  buy.listingTime = buy.listingTime.toString();
  buy.expirationTime = buy.expirationTime.toString();
  buy.salt = buy.salt.toFixed()
  // buy.salt = ethers.BigNumber.from(buy.salt.toFixed()).toString()
  let sell = result.sell;
  //console.log({sell:sell});
  sell.quantity = sell.quantity.toString();
  sell.makerRelayerFee = sell.makerRelayerFee.toString();
  sell.takerRelayerFee = sell.takerRelayerFee.toString();
  sell.makerProtocolFee = sell.makerProtocolFee.toString();
  sell.takerProtocolFee = sell.takerProtocolFee.toString();
  sell.makerReferrerFee = sell.makerReferrerFee.toString();
  sell.basePrice = sell.basePrice.toString();
  sell.extra = sell.extra.toString();
  sell.currentBounty = sell.currentBounty.toString();
  sell.currentPrice = sell.currentPrice.toString();
  sell.createdTime = sell.createdTime.toString();
  sell.listingTime = sell.listingTime.toString();
  sell.expirationTime = sell.expirationTime.toString();
  sell.salt = ethers.BigNumber.from(sell.salt.toFixed()).toString();
  //sell.salt = ethers.BigNumber.from(sell.salt).toString();
  //console.log("sell salt", ethers.BigNumber.from(buy.salt.toString()).toString())
  let padAddy = ethers.utils.hexZeroPad(accountAddress)
  //console.log("padAddy", padAddy)
  var metadata = order.metadata.referrerAddress;
  if (metadata && ethers.utils.isAddress(metadata)) {
    //metadata
  }else{
    metadata = accountAddress;
  }

  //this.seaport._atomicMatch({ buy: buy, sell: sell, accountAddress: accountAddress, metadata: referrer });
  let value = await this.seaport._getRequiredAmountForTakingSellOrder(sell);
  // let args = [
  //     [buy.exchange, buy.maker, buy.taker, buy.feeRecipient, buy.target,
  //         buy.staticTarget, buy.paymentToken, sell.exchange, sell.maker, sell.taker, sell.feeRecipient, sell.target, sell.staticTarget, sell.paymentToken],
  //     [buy.makerRelayerFee.toString(), buy.takerRelayerFee.toString(), buy.makerProtocolFee.toString(), buy.takerProtocolFee.toString(), buy.basePrice.toString(), buy.extra.toString(), buy.listingTime.toString(), buy.expirationTime.toString(), buy.salt.toString(), sell.makerRelayerFee.toString(), sell.takerRelayerFee.toString(), sell.makerProtocolFee.toString(), sell.takerProtocolFee.toString(), sell.basePrice.toString(), sell.extra.toString(), sell.listingTime.toString(), sell.expirationTime.toString(), ethers.BigNumber.from(sell.salt.toFixed()).toString()],
  //     [buy.feeMethod, buy.side, buy.saleKind, buy.howToCall, sell.feeMethod, sell.side, sell.saleKind, sell.howToCall],
  //     buy.calldata,
  //     sell.calldata,
  //     buy.replacementPattern,
  //     sell.replacementPattern,
  //     buy.staticExtradata,
  //     sell.staticExtradata,
  //     [
  //         buy.v || 0,
  //         sell.v || 0
  //     ],
  //     [
  //         buy.r || NULL_BLOCK_HASH,
  //         buy.s || NULL_BLOCK_HASH,
  //         sell.r || NULL_BLOCK_HASH,
  //         sell.s || NULL_BLOCK_HASH,
  //         //accountAddress
  //         //metadata
  //         accountAddress.toLowerCase()+"000000000000000000000000"
  //         //0x31b17aab797aa181e83c259d5f1585691e2eabec86c068412bb277db5168ec54
  //         //"0x0000000000000000000000000000000000000000000000000000000000000000"
  //         //NULL_BLOCK_HASH
  //         //0x0000000000000000000000004Bdc5E2dadC6D32B7468d710F5004b2eE2334724
  //         //ethers.utils.hexlify(metadata.substring(2))
  //         //metadata.substring(2)//ethers.utils.zeroPad(metadata.substring(2))
  //     ]
  // ];
  // let args = [
  //     [buy.exchange, buy.maker, buy.taker, buy.feeRecipient, buy.target,
  //         buy.staticTarget, buy.paymentToken, sell.exchange, sell.maker, sell.taker, sell.feeRecipient, sell.target, sell.staticTarget, sell.paymentToken],
  //     [buy.makerRelayerFee, buy.takerRelayerFee, buy.makerProtocolFee, buy.takerProtocolFee, buy.basePrice, buy.extra, buy.listingTime, buy.expirationTime, buy.salt, sell.makerRelayerFee, sell.takerRelayerFee, sell.makerProtocolFee, sell.takerProtocolFee, sell.basePrice, sell.extra, sell.listingTime, sell.expirationTime, sell.salt],
  //     [buy.feeMethod, buy.side, buy.saleKind, buy.howToCall, sell.feeMethod, sell.side, sell.saleKind, sell.howToCall],
  //     buy.calldata,
  //     sell.calldata,
  //     buy.replacementPattern,
  //     sell.replacementPattern,
  //     buy.staticExtradata,
  //     sell.staticExtradata,
  //     [
  //         buy.v || 0,
  //         sell.v || 0
  //     ],
  //     [
  //         buy.r || NULL_BLOCK_HASH,
  //         buy.s || NULL_BLOCK_HASH,
  //         sell.r || NULL_BLOCK_HASH,
  //         sell.s || NULL_BLOCK_HASH,
  //         accountAddress
  //     ]
  // ];
  let args = [
      [buy.exchange, buy.maker, buy.taker, buy.feeRecipient, buy.target,
          buy.staticTarget, buy.paymentToken, sell.exchange, sell.maker, sell.taker, sell.feeRecipient, sell.target, sell.staticTarget, sell.paymentToken],
      [buy.makerRelayerFee, buy.takerRelayerFee.toString(), buy.makerProtocolFee, buy.takerProtocolFee, buy.basePrice.toString(), buy.extra.toString(), buy.listingTime.toString(), buy.expirationTime.toString(), buy.salt.toString(), sell.makerRelayerFee.toString(), sell.takerRelayerFee.toString(), sell.makerProtocolFee.toString(), sell.takerProtocolFee.toString(), sell.basePrice.toString(), sell.extra.toString(), sell.listingTime.toString(), sell.expirationTime.toString(), sell.salt],
      [buy.feeMethod, buy.side, buy.saleKind, buy.howToCall, sell.feeMethod, sell.side, sell.saleKind, sell.howToCall],
      buy.calldata,
      sell.calldata,
      buy.replacementPattern,
      sell.replacementPattern,
      buy.staticExtradata,
      sell.staticExtradata,
      [
          buy.v || 0,
          sell.v || 0
      ],
      [
          buy.r || NULL_BLOCK_HASH,
          buy.s || NULL_BLOCK_HASH,
          sell.r || NULL_BLOCK_HASH,
          sell.s || NULL_BLOCK_HASH,
          accountAddress.toLowerCase()//+"000000000000000000000000"
      ]
  ];
  return {
    payload: args,
    buy: buy,
    sell: sell
  };
  //console.log('args',  args[10]);
/*
  let atomicMatchInterface = new ethers.utils.Interface(
    //"function atomicMatch_(Order memory buy, Sig memory buySig, Order memory sell, Sig memory sellSig, bytes32 metadata)"
    '[{"constant":false,"inputs":[{"name":"addrs","type":"address[14]"},{"name":"uints","type":"uint256[18]"},{"name":"feeMethodsSidesKindsHowToCalls","type":"uint8[8]"},{"name":"calldataBuy","type":"bytes"},{"name":"calldataSell","type":"bytes"},{"name":"replacementPatternBuy","type":"bytes"},{"name":"replacementPatternSell","type":"bytes"},{"name":"staticExtradataBuy","type":"bytes"},{"name":"staticExtradataSell","type":"bytes"},{"name":"vs","type":"uint8[2]"},{"name":"rssMetadata","type":"bytes32[5]"}],"name":"atomicMatch_","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]'
  );

  //console.log("abi", atomicMatchInterface)

  let functionData = atomicMatchInterface.encodeFunctionData("atomicMatch_", [
    args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]
  ]);
  //
  // console.log("encoded function data", functionData)

  let tx = {
    to: "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b",
    from: accountAddress,
    data: functionData,
    value: value//ethers.utils.formatEther(value.toString())//.toString()
  }
  return tx;
*/
  // os WyvernExchange contract 0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b

  //let tx =
  //build tx from opensea api
  //create mini ethers abi for atomicMatch against wyvern
  //instatiate wyvern contract
  //tx to wyvern contract
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
