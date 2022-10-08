const express = require('express')
const router = express.Router()

const database = require("../services/database");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', (req, res) => {
    res.send('DRAFT: List of categories')
})

router.get('/raw-data', async (req, res) => {
    const { data, error } = await database.getPoaps()
    res.send(data)
})

router.get('/{audienceId}', (req, res) => {
    res.send('DRAFT: List of wallets for this audience')
})

module.exports = router