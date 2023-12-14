"use strict";
export type SpotMarketTradedOrder = {
    "topic": string,
    "type": string,
    "data": {
        "makerOrderId": string,
        "price": string,
        "sequence": string,
        "side": string,
        "size": string,
        "symbol": string,
        "takerOrderId": string,
        "time": string,
        "tradeId": string,
        "type": string
    },
    "subject": string
}

export type KucoinSubscriptionObject = {
    "id": number,
    "type": string,
    "topic": string,
    "privateChannel": boolean,
    "response": boolean 
}

export type AggresiveStrippedOrder = {
    "side": string,
    "size": number,
}
type TradeData = {
    "sequence":string,
    "price":string,
    "size":string,
    "side":string,
    "time":number
}
export type HistoricalTrades = {
	"code":string,
	"data":TradeData[]
}