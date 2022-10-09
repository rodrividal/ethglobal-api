require('dotenv').config();

const express = require("express");
const cors = require('cors')

const audiences = require('./app/audiences');
const messages = require('./app/messages');
const dataunions = require('./app/dataunions');
const users = require('./app/users');
const database = require('./app/database');
const bodyParser = require('body-parser');

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', users);
app.use('/database-connection', database);
app.use('/audiences', audiences);
app.use('/messages', messages);
app.use('/dataunions', dataunions);

app.get("/", (req, res) => {
    const endpoints = [
        {url: '/database-connection', description: "This is only to check supabase db connection"},
        {url: '/audiences', description: "This returns the list of audiences or classifications"},
        {url: '/audiences/check-volume', description: "This returns the size of the specific keywords"},
        {url: '/campaigns/create', description: "This is the endpoint to create a new campaign"},
    ]
    res.send(endpoints);
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;