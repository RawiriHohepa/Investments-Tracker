import express from "express";
import kraken from "./kraken";
import nexo from "./nexo";
import exodus from "./exodus";
import yoroi from "./yoroi";
import terra from "./terra";
import { getCoins } from "./prices";

const router = express.Router();

export const crypto = async (nexoNsi: string, exodusXmrAmount: number) => {
    const coinsWithoutPrices = [
        ...await kraken(),
        ...await nexo(nexoNsi),
        ...await exodus(exodusXmrAmount),
        ...await yoroi(),
        ...await terra(),
    ];
    return await getCoins(coinsWithoutPrices);
};

router.get('/', async (req, res, next) => {
    const { nexo_nsi, exodus_xmr_amount } = req.query;
    if (
        (typeof nexo_nsi !== "string" || !nexo_nsi)
        || (typeof exodus_xmr_amount !== "string" || !exodus_xmr_amount || isNaN(parseFloat(exodus_xmr_amount)))
    ) {
        // TODO send more meaningful errors
        res.sendStatus(400);
        return;
    }

    try {
        res.json(await crypto(nexo_nsi, parseFloat(exodus_xmr_amount)));
    } catch (err) {
        next(err);
    }
});

router.get('/kraken', async (req, res, next) => {
    try {
        const coinsWithoutPrices = await kraken();
        res.json(await getCoins(coinsWithoutPrices));
    } catch (err) {
        next(err);
    }
});

router.get('/nexo', async (req, res, next) => {
    const { nsi } = req.query;
    if (typeof nsi !== "string" || !nsi) {
        // TODO send more meaningful errors
        res.sendStatus(400);
        return;
    }

    try {
        const coinsWithoutPrices = await nexo(nsi);
        res.json(await getCoins(coinsWithoutPrices));
    } catch (err) {
        next(err);
    }
});

router.get('/exodus', async (req, res, next) => {
    const { xmr_amount } = req.query;
    if (typeof xmr_amount !== "string" || !xmr_amount || isNaN(parseFloat(xmr_amount))) {
        // TODO send more meaningful errors
        res.sendStatus(400);
        return;
    }

    try {
        const coinsWithoutPrices = await exodus(parseFloat(xmr_amount));
        res.json(await getCoins(coinsWithoutPrices));
    } catch (err) {
        next(err);
    }
});

router.get('/yoroi', async (req, res, next) => {
    try {
        const coinsWithoutPrices = await yoroi();
        res.json(await getCoins(coinsWithoutPrices));
    } catch (err) {
        next(err);
    }
});

router.get('/terra', async (req, res, next) => {
    try {
        const coinsWithoutPrices = await terra();
        res.json(await getCoins(coinsWithoutPrices));
    } catch (err) {
        next(err);
    }
});

export default router;
