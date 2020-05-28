const MongoClient = require('mongodb').MongoClient

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 27017
const DB_NAME = process.env.DB_NAME || 'tt-spring2020-test'

const startDB = async (callback) => {
    const url = `mongodb://${DB_HOST}:${DB_PORT}`
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

    console.log(`Connecting to database...`)

    try {
        await client.connect()
        console.log(`Connection to database at ${url} completed successfully!`)
        const db = client.db(DB_NAME)
        await callback(db);
    } catch(err) {
        console.log(err.stack)
    } finally {
        client.close();
    }
}

module.exports = {
    startDB
}
