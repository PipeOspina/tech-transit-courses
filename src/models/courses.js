const { startDB } = require('../db')
const { changeIds } = require('../utils')

const COLLECTION_NAME = 'Courses'

const getCourses = async (query) => {
    try {
        const { db, client } = await startDB()
        const courseCollection = await db.collection(COLLECTION_NAME)
        const coursesCursor = await courseCollection.find(query ? query : '')
        const courses = await coursesCursor.toArray()
        client.close()
        return courses
    } catch(err) {
        console.log('Error at getCourses()', err)
        return []
    }
}

const getCourse = async (_id) => {
    try {
        const { db, client } = await startDB()
        const courseCollection = await db.collection(COLLECTION_NAME)
        const course = await courseCollection.findOne({ _id })
        client.close()
        return course
    } catch(err) {
        console.log('Error at getCourse()', err)
        return {}
    }
}

const createCourse = async (course) => {
    try {
        const { db, client } = await startDB()
        const courseCollection = await db.collection(COLLECTION_NAME)
        if(course.id) {
            course._id = course.id
            delete course.id
        }
        try {
            await courseCollection.insertOne(course)
            console.log(`Course ${course._id} inserted successfully!`)
        } catch(err) {
            console.error(err.errmsg, '- This course wont be created.')
        }
        client.close()
    } catch(err) {
        console.log('Error at createCourse()', err)
    }
    return course
}

const createCourses = async (courses) => {
    try {
        courses = await changeIds(courses)
        const length = courses.length;
    
        const { db, client } = await startDB()
        const courseCollection = await db.collection(COLLECTION_NAME)
    
        const insertedCount = length ? await tryToInsertMany(courses, courseCollection) : 0
        const msg = (insertedCount ?
            (length - insertedCount) !== 0 ?
                `${insertedCount} courses was inserted successfully - ${length - insertedCount} was refused by duplicate.` :
                `All courses (${insertedCount}) was inserted successfully!` :
            (length - insertedCount) !== 0 ?
                `All courses (${length - insertedCount}) was refused by duplicate.` :
                `Any course found`
        )
        console.log(msg)
        client.close()
    } catch(err) {
        console.log('Error at createCourses()', err)
    }
    return courses
}

const tryToInsertMany = async (courses, courseCollection) => {
    try {
        const result = await courseCollection.insertMany(courses)
        return result.insertedCount
    } catch(err) {
        if(err.code === 11000) {
            console.error(err.errmsg, '- This course wont be created.')
            courses.splice(err.index, 1)
            return await tryToInsertMany(courses, courseCollection)
        }
        return 0
    }
}

module.exports = {
    getCourse,
    getCourses,
    createCourse,
    createCourses
}
