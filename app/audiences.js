const express = require('express')
const router = express.Router()

const database = require("../services/database");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', (req, res) => {
    const categories = [
        {id: 1, name: "Bitcoin", volume: 12009},
        {id: 2, name: "Gaming", volume: 18020}
    ]
    res.json(categories)
})

router.get('/check-volume', async (req, res) => {
    const q = req.query.q
    const keywords = q.split(';').map((x) => { return x.trim()})
    const { data, error, count } = await database.poapsByKeyword(keywords)

    console.log(data)

    const results = { volume: data ? data.length : 0 , data: data}
    res.json(results)
})

router.get('/{audienceId}', (req, res) => {
    res.send('DRAFT: List of wallets for this audience')
})

module.exports = router