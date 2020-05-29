const express = require('express')

const migrate = require('./src/migrate')
const routes = require('./src/routes')

const PORT = process.env.SERVER_PORT || 8000

const app = express()

app.use('/', routes)
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`)
    await migrate()
})
