"use strict";
import Websocket from 'ws';
import { transformHistoricalTrade, getCurrentCumulativeDelta, transformNextOrderTradedSides, getNumberOfDeltaConsumed, nullifyCDandNbOfDeltaConsumed } from './KucoinAdapter';
import { SpotMarketTradedOrder, KucoinSubscriptionObject, HistoricalTrades } from '../CustomTypesComponent/CustomTypes'
import { app } from '../cumulative_delta';
import { UsablePairs } from '../../Assets/UsablePairs';

let soc : Websocket;

/***ROUTES**/
app.get('/kucoin/UsablePairs',(req,res)=>{
    nullifyCDandNbOfDeltaConsumed();
    res.json(UsablePairs)
});
app.get('/kucoin/CumulativeDelta/reInit',(req,res)=>{
    nullifyCDandNbOfDeltaConsumed();
    res.sendStatus(200);
});
app.get('/kucoin/CumulativeDelta/update', 
    (req,res)=>{
        if(req.body["pair"]!==undefined && req.body["pair"]!==""){
            if (soc===undefined || soc.readyState === Websocket.CLOSED) {
                let kucoinSubscriptionObject : KucoinSubscriptionObject = {"id": 1545910660741,"type": "subscribe","topic": "/market/match:"+req.body["pair"],"privateChannel": false,"response": false };
                initWsConnection();
                soc.on('open',()=>{
                    PopulateAllOrderTraded(kucoinSubscriptionObject);
                    let objToSend={
                        "pair" :req.body["pair"],
                        'CurrentCumulativeDelta':getCurrentCumulativeDelta(),
                        "NumberOfOrdersConsumed":getNumberOfDeltaConsumed()
                    }        
                    res.json(objToSend);
                })
            }else{
                let objToSend={
                    "pair" :req.body["pair"],
                    'CurrentCumulativeDelta':getCurrentCumulativeDelta(),
                    "NumberOfOrdersConsumed":getNumberOfDeltaConsumed(),
                }
                res.json(objToSend);
            }
        }else{
            nullifyCDandNbOfDeltaConsumed();
            let objToSend={
                "pair" :"No PAIR PROVIDED"
            }
            
            res.json(objToSend);
        }
    }
);

app.get('/kucoin/CumulativeDelta/history',async (req ,res)=>{
    //console.log(req.body)
    if(req.body["pair"]!==undefined && req.body["pair"]!==""){
        await PopulateHistoricalTrade(req.body["pair"])
        let objToSend={
            "pair" :req.body["pair"],
            'CurrentCumulativeDelta':getCurrentCumulativeDelta(),
            "NumberOfOrdersConsumed":getNumberOfDeltaConsumed()
        }        
        nullifyCDandNbOfDeltaConsumed();
        res.json(objToSend);
    }else{
        nullifyCDandNbOfDeltaConsumed();
        let objToSend={
            "pair" :"No PAIR PROVIDED"
        }
        
        res.json(objToSend);
    }
});

/***EXPORTS****/

export let allOrderTraded : any[] = [];

export function initWsConnection() : Websocket{
    if (!soc || soc.readyState === Websocket.CLOSED) {
        // Create a new WebSocket connection only if it doesn't exist or if the previous one is closed
        soc = new Websocket('wss://ws-api-spot.kucoin.com/?token=2neAiuYvAU61ZDXANAGAsiL4-iAExhsBXZxftpOeh_55i3Ysy2q2LEsEWU64mdzUOPusi34M_wGoSf7iNyEWJ54Oe-iyz7E_WJ2BncDdl0lCMGrQTnLXEdiYB9J6i9GjsxUuhPw3BlrzazF6ghq4L3xVDX9u67TMn0jiD4p2KPc=.qvFmAMtPA4hqSW0_CcCPpA==&connectId=DaintyIdConnect');
        // Event handler for errors
        soc.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }
    return soc;
}

export function PopulateAllOrderTraded(customRequest : KucoinSubscriptionObject){
    initWsConnection();
    if(soc.OPEN){
        soc.send(
            JSON.stringify(customRequest),()=>{
                allOrderTraded = [];
                soc.on('message',(response)=>{
                    let nextTradedOrder : SpotMarketTradedOrder = JSON.parse(response.toString('utf-8'));
                    allOrderTraded.push(nextTradedOrder);
                    transformNextOrderTradedSides(nextTradedOrder);
                })
            }
        )
    }
}

export async function PopulateHistoricalTrade(pair : string){
    await fetch(`https://api.kucoin.com/api/v1/market/histories?symbol=${pair}`)
    .then((response)=> response.json())
    .then((data)=>{
        let historicalTradesBatch : HistoricalTrades = data as HistoricalTrades;
        transformHistoricalTrade(historicalTradesBatch);
        return historicalTradesBatch;
    })
}