const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');

const database = require("../services/database");

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', async (req, res) => {
    const { data, error, count } = await database.getCategories()
    res.json(data)
})

const queryPoapApi = async (query, variables = {}) => {
    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 5000 } = options;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        }).then(res => res.json()).then(json => {return json}).catch(e => console.log(e));
        clearTimeout(id);
        return response;
    }

    return await fetchWithTimeout('https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai', {
        method: 'post',
        body: JSON.stringify({query, variables})
    })
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

    const wallets = result.data.tokens.map((x) => {
        return x.owner.id
    })

    return [...new Set(wallets)];
}

const getHoldersWalletOfEvent = async (id, saveWallets) => {
    try {
        const query = `
    {
        tokens(
            where: {event: "` + id + `", owner_not: "0x0000000000000000000000000000000000000000"},
            first: 10,
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

        const wallets = result.data.tokens.map((x) => {
            return x.owner.id
        })

        saveWallets(wallets)
    } catch (e) {
        console.log('Retrying')
        await new Promise(r => setTimeout(r, 500));
        getHoldersWalletOfEvent(id, saveWallets)
    }
}

const getHoldersWalletOfEventsAsync = async (events) => {
    let collectedWallets = []
    let sourcesOfCollection = events.length
    let counterOfProcessedSources = 0

    const saveWallets = (addresses) => {
        for (let i = 0; i < addresses.length; i++) {
            collectedWallets.push(addresses[i])
        }
        counterOfProcessedSources += 1
        console.log("Total: ", sourcesOfCollection)
        console.log("Current: ", counterOfProcessedSources)
        console.log("Pending: ", sourcesOfCollection - counterOfProcessedSources)
    }

    for (let i = 0; i < events.length; i++) {
        let event = events[i]
        getHoldersWalletOfEvent(event.id, saveWallets)
    }

    while (true) {
        await new Promise(r => setTimeout(r, 1000));
        if (counterOfProcessedSources === sourcesOfCollection) {
            break
        }
    }

    return [...new Set(collectedWallets)];
}

router.get('/check-volume', async (req, res) => {
    const q = req.query.q
    const keywords = q.split(';').map((x) => { return x.trim()})
    const { data, error, count } = await database.poapsByKeyword(keywords)

    console.log("Quantity of events:")
    console.log(data.length)

    const wallets = await getHoldersWalletOfEventsAsync(data)

    console.log("Volume for keywords:")
    console.log(wallets.length)

    console.log("Segmented wallets:")
    console.log(wallets)

    const results = { volume: wallets.length}
    res.json(results)
})

module.exports = router