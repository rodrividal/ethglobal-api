const fetch = require('node-fetch');

const fetchWithTimeout = async (resource, options = {}) => {
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

exports.fetchWithTimeout = fetchWithTimeout;