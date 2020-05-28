const express = require('express')
const path = require('path')

const PORT = process.env.SERVER_PORT || 8000;

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
