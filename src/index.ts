import express from "express";
require("dotenv").config();

import simplicity from './simplicity';
import ird from './ird';
import investNow from './investNow';
import cryptoRoutes, { crypto } from "./crypto";

// Setup Express
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000 || 3001 || 3002;

// Setup JSON parsing for the request body
app.use(express.json());
app.use("/api", router);

// Setup our routes.

router.get("/", async (req, res, next) => {
  const { nexo_nsi, exodus_xmr_amount } = req.query;
  if (
    (typeof nexo_nsi !== "string" || !nexo_nsi)
    || (typeof exodus_xmr_amount !== "string" || !exodus_xmr_amount || isNaN(parseFloat(exodus_xmr_amount)))
  ) {
    res.sendStatus(400);
    return;
  }

  try {
    res.json({
      simplicity: await simplicity(),
      ird: await ird(),
      investNow: await investNow(),
      crypto: await crypto(nexo_nsi, parseFloat(exodus_xmr_amount)),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/simplicity", async (req, res, next) => {
  try {
    res.json(await simplicity());
  } catch (err) {
    next(err);
  }
});

router.get("/ird", async (req, res, next) => {
  try {
    res.json(await ird());
  } catch (err) {
    next(err);
  }
});

router.get("/investNow", async (req, res, next) => {
  try {
    res.json(await investNow());
  } catch (err) {
    next(err);
  }
});

router.use("/crypto", cryptoRoutes);

app.listen(port, () => console.log(`App server listening on port ${port}!`));
