"use strict";
import { app } from '../src/cumulative_delta';

/***ROUTES**/
const port = process.env.PORT || 3000;

app.listen(port, () => {
    //console.log(`Serveur lancé at http://localhost:${port}`);
});