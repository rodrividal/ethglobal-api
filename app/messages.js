const express = require('express')
const database = require("../services/database");
const DU = require("../services/dataunions");
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
    req.setTimeout(500000);

    const { title, description, image_url, link, keyword } = req.body;

    const categoryExists = await database.categoryExists(keyword)

    if (!categoryExists) {
        try {
            let du = await DU.createDataUnion(keyword, "This is the data union for the following category: " + keyword)
            await database.insertDataUnion(keyword, du.getAddress())
        } catch (e) {
            res.status(500).json({ message: JSON.stringify(e) });
            return;
        }
    }

    await database.insertMessage({ title, description, image_url, link, keyword });

    const du = await database.getDataUnion(keyword)

    res.json(du);
})

router.post('/verify', async (req, res) => {
    const { message_id } = req.body;

    const response = await database.verifyMessage(message_id);

    if (typeof response === "undefined") {
        res.status(500).json({ message: "error" });
        return;
    }

    res.status(200).json({ message: "ok" });
})

router.post('/watch', async (req, res) => {
    const { address, message_id } = req.body;

    const response = await database.insertWatchedAd({ address, message_id });

    const { data, error } = await database.getMessageById(message_id)

    if (typeof response === "undefined") {
        res.status(500).json({ message: "error" });
        return;
    }

    res.status(200).json(data[0]);
})

router.get('/test', async (req, res) => {
    const du = await database.getDataUnion("sillas")
    res.json(du);
})

module.exports = router
