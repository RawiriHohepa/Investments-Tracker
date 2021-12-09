import express from 'express'
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

app.get('/simplicity', async (req, res, next) => {
    try {
        res.json(await simplicity());
    } catch (err) {
        next(err);
    }
});

app.get('/ird', async (req, res, next) => {
    try {
        res.json(await ird());
    } catch (err) {
        next(err);
    }
});

app.get('/investNow', async (req, res, next) => {
    try {
        res.json(await investNow());
    } catch (err) {
        next(err);
    }
});

app.get('/yoroi', async (req, res, next) => {
    try {
        res.json(await yoroi());
    } catch (err) {
        next(err);
    }
});

const crypto = async () => {
    return [
        ...await yoroi(),
    ];
};

app.get('/crypto', async (req, res, next) => {
    try {
        res.json(await crypto());
    } catch (err) {
        next(err);
    }
});

app.get('/api', async (req, res, next) => {
    try {
        res.json({
            simplicity: await simplicity(),
            ird: await ird(),
            investNow: await investNow(),
            crypto: await crypto()
        });
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => console.log(`App server listening on port ${port}!`));
