const COURSE_IMAGE_CLASS = 'course-img'
const COURSE_TITLE_CLASS = 'course-title'
const COURSE_DESC_CLASS = 'course-desc'
const COURSE_PRICE_CLASS = 'course-price'
const COURSE_CREDITS_CLASS = 'course-credits'
const COURSE_RATING_CLASS = 'course-rating'

const container = document.getElementById('courses-container')
const baseCardCourse = document.getElementById('course-0000')

const creditsSlide = document.getElementById('credits')
const starsSlide = document.getElementById('stars')
const priceSlide = document.getElementById('price')

const searchInput = document.getElementById('search')

const footerLabel = document.getElementById('footer-label')

const credits = window._courses.map(course => {
    return course.maximumCredits
})
const stars = window._courses.map(course => {
    return course.rating
})
const prices = window._courses.map(course => {
    return course.price
})

let currentCourses = window._courses

let filters = {
    credits: 0,
    stars: 0,
    price: 0,
    search: ''
}

const start = () => {
    creditsSlide.max = Math.max(...credits) + 1
    starsSlide.max = Math.max(...stars)
    priceSlide.max = Math.max(...prices)
    creditsSlide.min = Math.min(...credits)
    starsSlide.min = Math.min(...stars)
    priceSlide.min = Math.min(...prices)
    creditsSlide.value = 0
    starsSlide.value = 0
    priceSlide.value = 0
    addRatingStars()
    buildCards(currentCourses)
}

const buildCards = async (elements) => {
    for await (const course of elements) {
        const copy = baseCardCourse.cloneNode(true)
        copy.id = course.id.toString().padStart(11, 'course-0000')
        for await (const element of copy.childNodes) {
            switchCardClassName(element, course)
        }
        container.appendChild(copy);
    }
}

const strip = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }

const switchCardClassName = (element, course) => {
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
            applyRatingColor(element, course.rating)
            break
        default:
            break
    }
}

const applyRatingColor = async (element, rating) => {
    const emptyStars = await element.childNodes[1].childNodes
    const fullStars = await element.childNodes[3].childNodes
    emptyStars.forEach((star, index) => {
        star.style.fill = switchRatingColors(rating)
        fullStars[index].style.fill = switchRatingColors(rating)
        if(rating === 5) {
            let size;
            if(index === 0 || index === 4) size = '1rem'
            else if(index === 1 || index === 3) size = '2rem'
            else size = '3rem'
            star.style.width = size
            star.style.height = size
            fullStars[index].style.width = size
            fullStars[index].style.height = size
            element.childNodes[1].style.display = 'flex'
            element.childNodes[3].style.display = 'flex'
            element.childNodes[1].style.alignItems = 'center'
            element.childNodes[3].style.alignItems = 'center'
        }
    })
}

const switchRatingColors = (rating) => {
    switch(true) {
        case (rating === 0):
            return 'darkred'
        case (rating > 0 && rating <=  1):
            return 'crimson'
        case (rating > 1 && rating <= 2):
            return 'darkorange'
        case (rating > 2 && rating <= 3):
            return 'orange'
        case (rating > 3 && rating <= 4):
            return 'greenyellow'
        case (rating > 4 && rating < 5):
            return 'forestgreen'
        default:
            return 'gold'
    }
}

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
    
    emptyStars.childNodes[0].remove()
    emptyStars.childNodes[1].remove()
    fullStars.childNodes[0].remove()
    fullStars.childNodes[1].remove()

    emptyStar.remove()
    fullStar.remove()
}

const applyFilter = (event) => {
    const value = !isNaN(parseInt(event.target.value)) ? parseInt(event.target.value) : event.target.value
    filters = {
        ...filters,
        [event.target.id]: value
    }
    console.log(filters)
    const allCourses = window._courses
    const filteredCourses = allCourses.filter((course) => {
        return (
            course.maximumCredits >= filters.credits &&
            course.rating >= filters.stars &&
            course.price >= filters.price &&
            course.name.toLowerCase().includes(filters.search)
        )
    })
    if(event.target.id !== 'search') {
        document.getElementById(`${event.target.id}-label`).textContent = value === 0 ? 'All' : `${value} at least`
    }
    currentCourses = filteredCourses
    footerLabel.textContent = filteredCourses.length === window._courses.length ? `Showing all courses (${window._courses.length})` : `Showing ${filteredCourses.length} of ${window._courses.length} courses`
    updateDOM()
}

const updateDOM = () => {
    const ids = currentCourses.map(course => {
        return course.id.toString().padStart(11, 'course-0000')
    })
    for (const child of container.childNodes) {
        if(child.tagName === 'SECTION') {
            child.style.display = ids.includes(child.id) ? 'grid' : 'none'
        }
    }
}

creditsSlide.addEventListener('input', applyFilter)
starsSlide.addEventListener('input', applyFilter)
priceSlide.addEventListener('input', applyFilter)
searchInput.addEventListener('input', applyFilter)

start()
