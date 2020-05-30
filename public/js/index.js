const COURSE_IMAGE_CLASS = 'course-img'
const COURSE_TITLE_CLASS = 'course-title'
const COURSE_DESC_CLASS = 'course-desc'
const COURSE_PRICE_CLASS = 'course-price'
const COURSE_CREDITS_CLASS = 'course-credits'
const COURSE_RATING_CLASS = 'course-rating'

const buildCards = async () => {
    for await (const course of window._courses) {
        const copy = baseCardCourse.cloneNode(true)
        copy.id = course.id.toString().padStart(11, 'course-0000')
        for await (const element of copy.childNodes) {
            switchCardClassName(element, course)
        }
        container.appendChild(copy);
    }
    baseCardCourse.remove()
}

const strip = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }

const switchCardClassName = (element, course) => {
    // element = document.getElementById('courses-container')
    switch(element.className) {
        case COURSE_IMAGE_CLASS:
            element.src = `https://techtransit.com/mission.courses${course.imageUrl}`
            element.alt = course.imageText
            break
        case COURSE_TITLE_CLASS:
            element.innerText = course.name
            break
        case COURSE_DESC_CLASS:
            element.innerText = strip(course.description)
            break
        case COURSE_PRICE_CLASS:
            element.innerText = `$ ${course.price.toFixed(2)}`
            break
        case COURSE_CREDITS_CLASS:
            element.innerText = `${course.maximumCredits} ${course.maximumCredits > 1 ? 'Credits' : 'Credit'}`
            break
        case COURSE_RATING_CLASS:
            element.childNodes[3].style.width = `${course.rating * 100 / 5}%`
            element.title = course.rating.toString()
            break
        default:
            break
    }
}

const container = document.getElementById('courses-container')
const baseCardCourse = document.getElementById('course-0000')

const addRatingStars = () => {
    const baseRating = baseCardCourse.childNodes[11]
    const emptyStars = baseRating.childNodes[1]
    const fullStars = baseRating.childNodes[3]
    const emptyStar = emptyStars.childNodes[1]
    const fullStar = fullStars.childNodes[1]
    
    for(let i = 0; i < 5; i++) {
        const emptyStarCopy = emptyStar.cloneNode(true)
        const fullStarCopy = fullStar.cloneNode(true)
        emptyStars.appendChild(emptyStarCopy)
        fullStars.appendChild(fullStarCopy)
    }
    
    emptyStar.remove()
    fullStar.remove()
}
    
addRatingStars()
buildCards()