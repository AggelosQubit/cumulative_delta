"use strict";
import { nullifyCDandNbOfDeltaConsumed } from "./src/KucoinComponent/KucoinAdapter";
import { CalculateCurrentCumulativeDelta, getCurrentCumulativeDeltaCore, getNumberOfDeltaConsumedCore } from "./src/cumulative_delta";

beforeEach(()=>{
    nullifyCDandNbOfDeltaConsumed()
})
describe("Kucoin Suite Tests - Port ",
    ()=>{
        test("should nullifyCDandNbOfDeltaConsumed for getCurrentCumulativeDeltaCore to be 0",
            ()=>{
                CalculateCurrentCumulativeDelta({size: 0.0208592,side: "sell",})
                nullifyCDandNbOfDeltaConsumed();
                expect(getCurrentCumulativeDeltaCore()).toBe(0);
            }
        )
        test("should nullifyCDandNbOfDeltaConsumed for getNumberOfDeltaConsumedCore to be 0",
            ()=>{
                CalculateCurrentCumulativeDelta({size: 0.0208592,side: "sell",})
                nullifyCDandNbOfDeltaConsumed();
                expect(getCurrentCumulativeDeltaCore()).toBe(0);
            }
        )
        test("should getCurrentCumulativeDelta for Sell Order",
            ()=>{
                CalculateCurrentCumulativeDelta({size: 0.0208592,side: "sell",})
                expect(getCurrentCumulativeDeltaCore()).toStrictEqual(-0.0208592);
            }
        )
        test("should getCurrentCumulativeDelta for Buy Order",
        ()=>{
            CalculateCurrentCumulativeDelta({size: 0.0208592,side: "buy",})
            expect(getCurrentCumulativeDeltaCore()).toStrictEqual(0.0208592);
        }
    )
        test("should numberOfConsumedtrades ",
        ()=>{
            CalculateCurrentCumulativeDelta({size: 0.0208592,side: "sell",})
            CalculateCurrentCumulativeDelta({size: 0.0208592,side: "buy",})
            console?.log(getNumberOfDeltaConsumedCore());
            expect(getNumberOfDeltaConsumedCore()).toStrictEqual(2);
        }
    )
    }
    
);