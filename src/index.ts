import express from 'express'
import path from 'path'
require('dotenv').config();

import simplicity from './simplicity/balances';
import ird from './ird/studentLoan';
import investNow from './investNow/balances';
import kraken from './kraken/balances';
import nexo from './nexo/balances';
import yoroi from './yoroi/balances';

// Setup Express
const app = express();
const port = process.env.PORT || 3000 || 3001 || 3002;

// Setup JSON parsing for the request body
app.use(express.json());

// Setup our routes.

// When we make a GET request to '/simplicity', send back this JSON content.
app.get('/simplicity', async (req, res) => {
    res.json(await simplicity());
});

// When we make a GET request to '/ird', send back this JSON content.
app.get('/ird', async (req, res) => {
    res.json(await ird());
});

// When we make a GET request to '/investNow', send back this JSON content.
app.get('/investNow', async (req, res) => {
    res.json(await investNow());
});

// When we make a GET request to '/kraken', send back this JSON content.
app.get('/kraken', async (req, res) => {
    res.json(await kraken());
});

// When we make a GET request to '/nexo', send back this JSON content.
app.get('/nexo', async (req, res) => {
    const { nsi } = req.query;
    if (typeof nsi !== "string" || !nsi) {
        res.sendStatus(400);
        return;
    }

    res.json(await nexo(nsi));
});

// When we make a GET request to '/yoroi', send back this JSON content.
app.get('/yoroi', async (req, res) => {
    res.json(await yoroi());
});

// When we make a GET request to '/api', send back this JSON content.
app.get('/api', async (req, res) => {
    const { nexo_nsi } = req.query;
    if (!!nexo_nsi && typeof nexo_nsi !== "string") {
        res.sendStatus(400);
        return;
    }

    res.json({
        simplicity: await simplicity(),
        ird: await ird(),
        investNow: await investNow(),
        kraken: await kraken(),
        nexo: nexo_nsi ? await nexo(nexo_nsi) : undefined,
    });
});

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, 'public')));

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, () => console.log(`App server listening on port ${port}!`));