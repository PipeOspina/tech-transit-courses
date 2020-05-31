const express = require('express')
const router = express.Router()

const { getCourses: getCoursesDB } = require('../models/courses')
const { switchQuery } = require('../utils')

const path = '/courses'

const getCourses = async (req, res) => {
    let queryToDB = {}
    for (const key in req.query) {
        const value = !isNaN(parseInt(req.query[key])) ? parseInt(req.query[key]) : 0;
        queryToDB = switchQuery({ key, value }, queryToDB)
    }
    try {
        const courses = await getCoursesDB(queryToDB)
        if(courses instanceof Error) throw courses
        res.json(courses)
        const msg = courses.length === 1 ? 
            `1 course sended.` :
            `${courses.length} courses sended.`
        console.log(msg)
    } catch(err) {
        res.status(500)
            .json({
                message: 'Internal server error :(',
                code: 500
            })
        console.log('Error at getCourses() routes', err)
    }
}

router
    .get(path, getCourses)

module.exports = router
