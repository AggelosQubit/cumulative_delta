"use strict";
import { SpotMarketTradedOrder, AggresiveStrippedOrder, HistoricalTrades } from '../CustomTypesComponent/CustomTypes'
import {    
    CalculateCurrentCumulativeDelta, 
    getCurrentCumulativeDeltaCore, 
    getNumberOfDeltaConsumedCore, 
    setCurrentCumulativeDeltaCore, 
    setNumberOfDeltaConsumed 
} from '../cumulative_delta';

export let allOrderTradedSides :AggresiveStrippedOrder[] = [];
export let historicalTradesBatch :HistoricalTrades;

export function transformNextOrderTradedSides( nextTradedOrder : SpotMarketTradedOrder){
    if(nextTradedOrder.data != null || nextTradedOrder.data != undefined){
        if (
                nextTradedOrder.data.side!=undefined && 
                nextTradedOrder.data.size!=undefined && 
                !Number.isNaN(parseFloat(nextTradedOrder.data.size))
        ){
            CalculateCurrentCumulativeDelta({
                side:nextTradedOrder.data.side,
                size:parseFloat(nextTradedOrder.data.size) 
            });
            return {side:nextTradedOrder.data.side,size:parseFloat(nextTradedOrder.data.size)}
        }
        return null;
    }

}
export function transformHistoricalTrade( historicalTradesBatchParam : HistoricalTrades){
    if(historicalTradesBatchParam.data != null || historicalTradesBatchParam.data != undefined){
        historicalTradesBatch = historicalTradesBatchParam;
        nullifyCDandNbOfDeltaConsumed();
        for(let i=0;i<historicalTradesBatchParam.data.length;i++)
            CalculateCurrentCumulativeDelta({
                side:historicalTradesBatchParam.data[i].side,
                size:parseFloat(historicalTradesBatchParam.data[i].size) 
            });
    }
}

export function nullifyCDandNbOfDeltaConsumed(){
    setCurrentCumulativeDeltaCore(0); 
    setNumberOfDeltaConsumed(0);
}
export function getCurrentCumulativeDelta(){
    return getCurrentCumulativeDeltaCore()
}

export function getNumberOfDeltaConsumed(){
    return getNumberOfDeltaConsumedCore()
}