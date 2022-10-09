const database = require("./database");
const { fetchWithTimeout } = require("./utils");

const query = async (query, variables = {}) => {
    return await fetchWithTimeout('https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai', {
        method: 'post',
        body: JSON.stringify({query, variables})
    })
}

const poapsFromAddress = async (address) => {
    return await fetchWithTimeout('https://frontend.poap.tech/actions/scan/' + address, {
        method: 'get'
    })
}

const interestsFromAddress = async (address) => {
    const { data, error, count } = await database.getCategories()

    const events = await poapsFromAddress(address)

    const matches = []

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < events.length; j++) {
            if (events[j].event.description.toLowerCase().includes(data[i].keyword.toLowerCase())) {
                matches.push(data[i])
                break
            }
        }
    }

    return matches
}

exports.query = query;
exports.poapsFromAddress = poapsFromAddress;
exports.interestsFromAddress = interestsFromAddress;