const express = require('express')
const router = express.Router()

const database = require('./../services/database')

router.use((req, res, next) => {
    console.log('Time when database: ', Date.now())
    next()
})

router.get('/', async (req, res) => {
    const data = await database.test()
    res.send(data)
})

module.exports = router