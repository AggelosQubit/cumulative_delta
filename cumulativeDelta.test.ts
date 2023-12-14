import { CalculateCurrentCumulativeDelta, getCurrentCumulativeDeltaCore } from "./src/cumulative_delta";

describe("Kucoin Suite Tests - Port ",
    ()=>{
        test("should getCurrentCumulativeDelta ",
            ()=>{
                CalculateCurrentCumulativeDelta({size: 0.0208592,side: "sell",})
                expect(getCurrentCumulativeDeltaCore()).toStrictEqual(-0.0208592);
            }
        )
    }
);