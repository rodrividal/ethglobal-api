const express = require('express')
const database = require("../services/database");
const router = express.Router()

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', async (req, res) => {
    const { data, error, count } = await database.getMessages()
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

module.exports = router
