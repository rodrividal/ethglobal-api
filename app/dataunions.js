const express = require('express')
const router = express.Router()

const database = require("../services/database");
const { interestsFromAddress } = require("../services/poap_api");
const DU = require("../services/dataunions");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.post('/subscribe', async (req, res) => {
    const { address } = req.body;
    const categories = await interestsFromAddress(address)

    for (let i = 0; i < categories.length; i++) {
        await DU.addMember(categories[i].address, address)
    }

    res.json(categories)
})

module.exports = router
