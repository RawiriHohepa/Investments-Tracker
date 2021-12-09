import express from 'express'
require('dotenv').config();

import simplicity from './simplicity/balances';
import ird from './ird/studentLoan';
import investNow from './investNow/balances';
import exodus from "./crypto/exodus";
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

const crypto = async (exodus_xmr_amount: number) => {
    return [
        ...await exodus(exodus_xmr_amount),
        ...await yoroi(),
    ];
};

app.get('/crypto', async (req, res, next) => {
    const { exodus_xmr_amount } = req.query;
    if (typeof exodus_xmr_amount !== "string" || !exodus_xmr_amount || isNaN(parseFloat(exodus_xmr_amount))) {
        res.sendStatus(400);
        return;
    }

    try {
        res.json(await crypto(parseFloat(exodus_xmr_amount)));
    } catch (err) {
        next(err);
    }
});

app.get('/crypto/exodus', async (req, res, next) => {
    const { xmr_amount } = req.query;
    if (typeof xmr_amount !== "string" || !xmr_amount || isNaN(parseFloat(xmr_amount))) {
        res.sendStatus(400);
        return;
    }

    try {
        res.json(await exodus(parseFloat(xmr_amount)));
    } catch (err) {
        next(err);
    }
});

app.get('/crypto/yoroi', async (req, res, next) => {
    try {
        res.json(await yoroi());
    } catch (err) {
        next(err);
    }
});

app.get('/api', async (req, res, next) => {
    const { exodus_xmr_amount } = req.query;
    if (typeof exodus_xmr_amount !== "string" || !exodus_xmr_amount || isNaN(parseFloat(exodus_xmr_amount))) {
        res.sendStatus(400);
        return;
    }

    try {
        res.json({
            simplicity: await simplicity(),
            ird: await ird(),
            investNow: await investNow(),
            crypto: await crypto(parseFloat(exodus_xmr_amount))
        });
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => console.log(`App server listening on port ${port}!`));
