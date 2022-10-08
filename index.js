require('dotenv').config();

const express = require("express");

const audiences = require('./app/audiences')
const users = require('./app/users')
const database = require('./app/database')

const app = express();

app.use('/users', users)
app.use('/database-connection', database)
app.use('/audiences', audiences)

app.get("/", (req, res) => {
    const endpoints = [
        {url: '/database-connection', description: "This is only to check supabase db connection"},
        {url: '/audiences', description: "This returns the list of audiences or classifications"},
        {url: '/audiences/id', description: "This returns the list of wallets that are part of that audience"},
        {url: '/audiences/raw-data', description: "This returns the raw data of poaps that are the main data source to build our audiences"},
    ]
    res.send(endpoints);
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;