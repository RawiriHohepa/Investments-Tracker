import express from 'express';
import path from 'path';
require('dotenv').config();

const simplicity = require('./simplicity/balances');

// Setup Express
const app = express();
const port = process.env.PORT || 3000;

// Setup JSON parsing for the request body
app.use(express.json());

// Setup our routes.

// When we make a GET request to '/simplicity', send back this JSON content.
app.get('/simplicity', async (req, res) => {
    res.json(await simplicity());
});

// When we make a GET request to '/api', send back this JSON content.
app.get('/api', async (req, res) => {
    res.json({
        simplicity: await simplicity(),
    });
});

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, 'public')));

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, () => console.log(`App server listening on port ${port}!`));