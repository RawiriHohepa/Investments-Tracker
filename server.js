import express from 'express';
import path from 'path';
require('dotenv').config();

const puppeteerFunc = require('./puppeteerFunc');

// Setup Express
const app = express();
const port = process.env.PORT || 3000;

// Setup JSON parsing for the request body
app.use(express.json());

// Setup our routes.

// When we make a GET request to '/api', send back this JSON content.
// Uses the "name" query param e.g. http://localhost:3000/api?name=Clara
app.get('/api', async (req, res) => {
    await puppeteerFunc();

    res.json({
        greeting: 'Hello, world!',
        name: req.query.name
    });
});

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, 'public')));

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, () => console.log(`App server listening on port ${port}!`));