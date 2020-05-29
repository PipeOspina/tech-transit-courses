const { createCourses } = require('./models/courses')
const { getDataFromUrl } = require('./utils')

const COURSES_FILE_URL = process.env.COURSES_FILE_URL || 'https://www.techtransit.com/mission.courses/coursesData.js'
const DO_MIGRATE_COURSES = process.env.DO_MIGRATE_COURSES || true

const migrate = async () => {
    if(
        (DO_MIGRATE_COURSES && DO_MIGRATE_COURSES !== 'false') ||
        DO_MIGRATE_COURSES === 'true' ||
        DO_MIGRATE_COURSES === undefined
    ) {
        try {
            const courses = await getDataFromUrl(COURSES_FILE_URL)
            return courses.err ?  [] : await createCourses(courses)
        } catch(err) {
            console.log(err)
        }
    }
    return []
}

module.exports = migrate
