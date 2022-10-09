const express = require('express')
const router = express.Router()

const database = require("../services/database");
const { interestsFromAddress } = require("../services/poap_api");
const DU = require("../services/dataunions");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/subscribe', async (req, res) => {
    const address = req.query.address;
    const categories = await interestsFromAddress(address)

    for (let i = 0; i < categories.length; i++) {

    }

    res.json(categories)
})

module.exports = router
