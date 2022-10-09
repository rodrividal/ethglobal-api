const express = require('express')
const database = require("../services/database");
const { interestsFromAddress } = require("../services/poap_api");
const router = express.Router()

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', async (req, res) => {
    const address = req.query.address;

    const categories = await interestsFromAddress(address)

    const keywords = categories.map(x => {
        return x.keyword.toLowerCase()
    })

    const { data, error, count } = await database.getMessagesByKeywords(keywords)

    res.json(data)
})

router.post('/', async (req, res) => {
    const { title, description, image_url, link, keyword } = req.body;

    console.log(title, description, image_url, link, keyword);

    const response = database.insertMessage({ title, description, image_url, link, keyword });

    if (typeof response === "undefined") {
        res.status(500).json({ message: "error" });
        return;
    }

    res.status(200).json({ message: "ok" });
})

router.post('/watch', async (req, res) => {
    const { address, message_id } = req.body;

    const response = database.insertWatchedAd({ address, message_id });

    if (typeof response === "undefined") {
        res.status(500).json({ message: "error" });
        return;
    }

    res.status(200).json({ message: "ok" });
})

module.exports = router
