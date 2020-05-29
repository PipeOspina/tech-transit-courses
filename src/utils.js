const fetch = require('node-fetch')

const READ_FILE_MODE = process.env.COURSES_FILE_MODE || 'BEGIN'
const READ_FILE_BEGIN = process.env.COURSES_FILE_BEGIN || 'window._courses = '
const READ_FILE_BRACE = process.env.COURSES_FILE_BRACE || '['

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

module.exports = {
    changeIds,
    getDataFromUrl
}
