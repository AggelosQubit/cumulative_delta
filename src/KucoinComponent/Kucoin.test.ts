"use strict";
import { WebSocket } from 'ws';
import { PopulateAllOrderTraded, PopulateHistoricalTrade, allOrderTraded, initWsConnection } from './KucoinPort';
import { transformNextOrderTradedSides, getCurrentCumulativeDelta, transformHistoricalTrade, historicalTradesBatch } from './KucoinAdapter';
import { HistoricalTrades, KucoinSubscriptionObject, SpotMarketTradedOrder } from '../CustomTypesComponent/CustomTypes';
import { setCurrentCumulativeDeltaCore } from '../cumulative_delta';

let ws : WebSocket;
beforeEach( ()=>{
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        ws.on('close',()=>{ws = initWsConnection();})
    }else{
        ws = initWsConnection();
    }
    
});

describe("Kucoin Suite Tests ---- Port ",
    ()=>{
        test("should return 1 if the connexion is open and ready to use",
            (done)=>{
                ws.on('open', ()=>{
                    expect(ws.readyState).toEqual(WebSocket.OPEN);
                    ws.close()
                    ws.on('close',()=>done())
                })
            }
        )

        test("Retrieve the ack object after the subscription",
            (done)=>{
                ws.on('open', ()=>{
                    let kucoinSubscriptionObject : KucoinSubscriptionObject = {"id": 1545910660741,"type": "subscribe","topic": "/market/match:BTC-USDT","privateChannel": false,"response": true };
                    PopulateAllOrderTraded(kucoinSubscriptionObject);
                    ws.on('message',
                        ()=>{
                            if(allOrderTraded.length>=1){
                                expect(allOrderTraded[0]).toBeDefined();
                            }
                            ws.close();
                        }
                    )
                    ws.on('close',()=>done())
                });
            }
        )

        test("Historical Trades should return an array data of a 100 orders",
            ()=>{
                expect(PopulateHistoricalTrade("ETH-USDT")).toBeDefined();
            }
        )
    }
);

describe("Kucoin Suite Tests ---- Adapter ",
    ()=>{
        test("should start filling allOrderTradedSides",
            (done)=>{
                let nextTradedOrder : SpotMarketTradedOrder = {
                    topic: "/market/match:BTC-USDT",
                    type: "message",
                    data: {
                        makerOrderId: "65787f76d857b400014c9ddd",
                        price: "41416.5",
                        sequence: "6208783375679489",
                        side: "buy",
                        size: "0.00001583",
                        symbol: "BTC-USDT",
                        takerOrderId: "65787f796676070007366a11",
                        time: "1702395769461000000",
                        tradeId: "6208783375679489",
                        type: "match"
                    },
                    subject: "trade.l3match"
                }
                expect(transformNextOrderTradedSides(nextTradedOrder)).toStrictEqual(
                    {
                        side:"buy",
                        size:parseFloat("0.00001583")
                    }
                );
                done();
            }
        )

        test("should getCurrentCumulativeDelta ",
            (done)=>{
                expect(getCurrentCumulativeDelta()).not.toBeNaN();
                done();
            }
        )
        test("should Transform Historical Trade and allow for Cumulative delta initialisation",
            async ()=>{
                await PopulateHistoricalTrade("BTC-USDT");
                expect((historicalTradesBatch!= undefined)? historicalTradesBatch.data.length:0)
                .toBeGreaterThan(0);
            }
        )


        test("should Transform Historical Trade and allow for Cumulative delta initialisation",
        ()=>{
                setCurrentCumulativeDeltaCore(0); 
                let historicalTradesBatchVar :HistoricalTrades = {
                    "code": "200000",
                    "data": [
                        {
                            "sequence": "5605525859747841",
                            "price": "2207.19",
                            "size": "0.4",
                            "side": "sell",
                            "time": 1702487841265000000
                        },
                        {
                            "sequence": "5605525859747844",
                            "price": "2207.18",
                            "size": "0.05",
                            "side": "sell",
                            "time": 1702487841265000000
                        }
                    ]
                }
                transformHistoricalTrade(historicalTradesBatchVar)
                expect(getCurrentCumulativeDelta()).toBe(-0.45);
            }
        )
    }
);