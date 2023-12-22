# cumulative_delta

Created a REST API which gives the cumulative delta of a specific trading pair.

Cumulative Volume Delta (CVD) is a way of using Delta to measure an asset's mid- to long-term buy and sell pressure. It compares buying and selling volume over time and offers insights into market behavior at specific price points

The REST API Uses Kucoin's API to fetch data and proceed with computation

# ENDPOINTS

You have 4 Endpoints at your disposal
http://localhost:3000/kucoin/UsablePairs
AVAILABLE PAIRS Kucoin(Care No Volume Everywhere)

http://localhost:8080/kucoin/CumulativeDelta/ReInit
That reinitialize the values of the CVD aswell as the number of aggresive orders consumed to calculate it

http://localhost:8080/kucoin/CumulativeDelta/update
that opens up a websocket connection to Kucoin's API and kickstart the CVD computation
you can refresh the current value with each call you get a CVD with more aggresive orders consumed

http://localhost:8080/kucoin/CumulativeDelta/history
that fetch 100 (not custumizable) recent oders on the selected pair and performs the computation

# Jest Test Suite

run command : npm test

# Parameters

for each Endpoints you need to precise the pair in the body with a json object
ex : {"pair":"BTC-USDT"}
