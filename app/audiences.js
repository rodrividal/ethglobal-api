const express = require('express')
const router = express.Router()
const https = require('https');
const fetch = require('node-fetch');

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

const queryPoapApi = async (query, variables = {}) => {
    const result = await fetch('https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai', {
        method: 'post',
        body: JSON.stringify({query, variables})
    }).then(res => res.json()).then(json => {return json}).catch(e => console.log(e))

    return result
}

const getHoldersCountOfEvents = async (events) => {
    const ids = events.map(x => {
        return '"' + x.id + '"'
    }).toString()

    const query = `
    {
        events(where: {id_in: [` + ids + `]}) {
            id
            tokenCount
        }
    }`

    const result = await queryPoapApi(query)

    return result.data.events.reduce(function (accumulator, x) {
        return accumulator + parseInt(x.tokenCount)
    }, 0)

}

const getHoldersWalletOfEvent = async (id) => {
    const query = `
    {
        tokens(
            where: {event_in: "` + id + `", owner_not: "0x0000000000000000000000000000000000000000"},
            first: 1000,
            skip: 0) {
                id
                transferCount
                created
                owner {
                    id
                    tokensOwned
                }
            },
         
         event(id: "` + id + `") {
            tokenCount
            transferCount
        }
    }`

    const result = await queryPoapApi(query)

    return result.data.tokens.map((x) => {
        return x.owner.id
    })
}

const getHoldersWalletOfEvents = async (events) => {
    const ids = events.map(x => {
        return '"' + x.id + '"'
    }).toString()

    const query = `
    {
        tokens(
            where: {event_in: [` + ids + `], owner_not: "0x0000000000000000000000000000000000000000"},
            first: 1000,
            skip: 0) {
                id
                transferCount
                created
                owner {
                    id
                    tokensOwned
                }
        },
    }`

    const result = await queryPoapApi(query)

    return result.data.tokens.map((x) => {
        return x.owner.id
    })
}

const getHoldersWalletOfEventsOld = async (events) => {
    let wallets = []
    for (let i = 0; i < events.length; i++) {
        let event = events[i]
        let holders = await getHoldersWalletOfEvent(event.id)
        console.log(holders)
        wallets = wallets.concat(holders)
    }
    return wallets
}

router.get('/check-volume', async (req, res) => {
    const q = req.query.q
    const keywords = q.split(';').map((x) => { return x.trim()})
    const { data, error, count } = await database.poapsByKeyword(keywords)

    const volume = await getHoldersCountOfEvents(data)
    const wallets = await getHoldersWalletOfEvents(data)

    console.log("Volume for keywords:")
    console.log(volume)

    console.log("Segmented wallets:")
    console.log(wallets)

    const results = { volume: volume, wallets: wallets}
    res.json(results)
})

module.exports = router