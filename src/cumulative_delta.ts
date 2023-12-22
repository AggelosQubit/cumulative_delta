"use strict";
import express from 'express';
import { AggresiveStrippedOrder } from './CustomTypesComponent/CustomTypes';
export const app = express();
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/****PORTS****/
require("./KucoinComponent/KucoinPort");
/****END PORTS****/

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

require("./server");

let currentCumulativeDelta : number = 0;
let numberOfDeltaConsumed: number = 0;

export function CalculateCurrentCumulativeDelta(newOrder :AggresiveStrippedOrder ){
    (newOrder.side==="buy")?
        currentCumulativeDelta+=newOrder.size:
        currentCumulativeDelta-=newOrder.size
    numberOfDeltaConsumed++;
}

export function getNumberOfDeltaConsumedCore(){
    return numberOfDeltaConsumed;
}
export function setNumberOfDeltaConsumed(nbOfDelta : number){
    numberOfDeltaConsumed = nbOfDelta;
}
export function getCurrentCumulativeDeltaCore(){
    return currentCumulativeDelta
}

export function setCurrentCumulativeDeltaCore(newDelta : number){
    currentCumulativeDelta = newDelta;
}