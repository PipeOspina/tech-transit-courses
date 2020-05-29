const fetch = require('node-fetch')

const READ_FILE_MODE = process.env.COURSES_FILE_MODE || 'BEGIN'
const READ_FILE_BEGIN = process.env.COURSES_FILE_BEGIN || 'window._courses = '
const READ_FILE_BRACE = process.env.COURSES_FILE_BRACE || '['

const MIN_CREDITS_QUERY = process.env.MIN_CREDITS_QUERY_VAR || 'minCredits'
const MIN_STARS_QUERY = process.env.MIN_STARS_QUERY_VAR || 'minStars'
const MIN_COST_QUERY = process.env.MIN_COST_QUERY_VAR || 'minCost'

const changeIds = async (items) => {
    items = items.map(item => {
        if(item.id) {
            const _id = item.id
            delete item.id
            return { ...item, _id }
        }
        return item
    })
    return items
}

const switchData = (body) => {
    switch(READ_FILE_MODE) {
        case 'BEGIN':
            return JSON.parse(body.slice(READ_FILE_BEGIN.length))
        case 'FIND':
            return JSON.parse(body.slice(body.indexOf(READ_FILE_BRACE)))
        default:
            return []
    }
}

const getDataFromUrl = async (url) => {
    try {
        const res = await fetch(url)
        let data;
        if(READ_FILE_MODE !== 'NONE') {
            const body = await res.text()
            data = switchData(body)
        } else data = res.json()
        return data
    } catch(err) {
        console.log('Error at getDataFromUrl()', err)
        return { err }
    }
}

const switchQuery = (query, queryToDB) => {
    let key = '';
    switch (query.key) {
        case MIN_CREDITS_QUERY:
            key = 'maximumCredits'
            break;
        case MIN_STARS_QUERY:
            key = 'rating'
            break;
        case MIN_COST_QUERY:
            key = 'price'
            break;
        default:
            console.log(switchQueryMessage(query))
            break;
    }
    return key ? {
        ...queryToDB,
        [key]: { $gte: query.value }
    } : queryToDB
}

const switchQueryMessage = (query) => {
    if(query.key.toLowerCase() === MIN_CREDITS_QUERY.toLowerCase() || query.key.toLowerCase().includes(MIN_CREDITS_QUERY.toLowerCase())) {
        return `Trying to access with undefined query: { ${query.key}: ${query.value} }, try with '${MIN_CREDITS_QUERY}' instead '${query.key}'`
    }
    if(query.key.toLowerCase() === MIN_STARS_QUERY.toLowerCase() || query.key.toLowerCase().includes(MIN_STARS_QUERY.toLowerCase())) {
        return `Trying to access with undefined query: { ${query.key}: ${query.value} }, try with '${MIN_STARS_QUERY}' instead '${query.key}'`
    }
    if(query.key.toLowerCase() === MIN_COST_QUERY.toLowerCase() || query.key.toLowerCase().includes(MIN_COST_QUERY.toLowerCase())) {
        return `Trying to access with undefined query: { ${query.key}: ${query.value} }, try with '${MIN_COST_QUERY}' instead '${query.key}'`
    }
    return `Trying to access with undefined query: { ${query.key}: ${query.value} }, try with '${MIN_CREDITS_QUERY}', '${MIN_STARS_QUERY}' or '${MIN_COST_QUERY}' instead '${query.key}'`
}

module.exports = {
    changeIds,
    getDataFromUrl,
    switchQuery,
    switchQueryMessage
}
