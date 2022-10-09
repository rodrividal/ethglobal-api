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

    for (let i = 0; i < data.length; i++) {
        data[i].seen = await database.watchedAdExists(address, data[i].id)
    }

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

    const message = await database.insertMessage({ title, description, image_url, link, keyword });

    const { data, error } = await database.getDataUnion(keyword)

    const response = {
        address: data.address,
        message_id: message[0].id
    }

    res.json(response);
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
    const { data, error} = await database.getDataUnion("sillas")
    console.log(data)

    const title = "title"
    const description = "ad"
    const image_url = 'asd'
    const link = 'asd'
    const keyword = 'dd'

    const message = await database.insertMessage({ title, description, image_url, link, keyword });
    console.log(message[0])

    res.json(data);
})

module.exports = router
