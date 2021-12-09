import express from 'express'
import path from 'path'
require('dotenv').config();

import simplicity from './simplicity/balances';
import ird from './ird/studentLoan';
import investNow from './investNow/balances';
import yoroi from './crypto/yoroi';

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

// When we make a GET request to '/yoroi', send back this JSON content.
app.get('/yoroi', async (req, res, next) => {
    try {
        res.json(await yoroi());
    } catch (err) {
        next(err);
    }
});

const crypto = async () => {
    return [...await yoroi()]
};

// When we make a GET request to '/yoroi', send back this JSON content.
app.get('/crypto', async (req, res) => {
    res.json(await crypto());
});

// When we make a GET request to '/api', send back this JSON content.
app.get('/api', async (req, res) => {
    res.json({
        simplicity: await simplicity(),
        ird: await ird(),
        investNow: await investNow(),
        crypto: await crypto()
    });
});

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, 'public')));

// app.use((err, req, res, next) => {
//     next(err);
// });

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, () => console.log(`App server listening on port ${port}!`));
