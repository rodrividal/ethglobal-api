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
    res.send("PoaPush!");
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;