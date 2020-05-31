const express = require('express')
const router = express.Router()
const path = require('path')
const favicon = require('serve-favicon')

const coursesRoute = require('./courses')

const logger = (req, res, next) => {
    console.log(`${req.method}: Access to '${req.protocol}://${req.get('host')}${req.originalUrl}' at ${new Date()}`)
    next()
}

const notFound = (req, res) => {
    res
        .status(404)
        .format({
            html: function() {
                res.sendFile(path.join(__dirname, '..', '..', 'public', '404.html'))
            },
            json: function() {
                res.json({
                    status: 404,
                    error: 'Not found'
                })
            },
            text: function() {
                res.send('404 - Not found :(')
            }
        })
}

router
    .use(favicon(path.join('public', 'favicon.ico')))
    .use(logger)
    .use(express.static(path.join(__dirname, '..', '..', 'public')))
    .use(coursesRoute)
    .use((req, res) => {
        
    })
    .use(notFound)

module.exports = router
