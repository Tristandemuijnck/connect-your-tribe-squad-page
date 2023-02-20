import express from 'express'
import bodyParser from 'body-parser'

const urlMember = "https://whois.fdnd.nl/api/v1/"
const urlSquad = "https://whois.fdnd.nl/api/v1/squad/"

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', async (req, res) => {

    const addonUrl = urlMember + "members?first=100"
    const data = await dataFetch(addonUrl)

    data.members.forEach(member => {
        // Random number generator
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    console.log(data)

    res.render('index', {
        data
    })
})

app.get('/FDND', async (req, res) => {
    let slug = req.query.squad || "squat-c-2022"
    let roleFilter = req.query.role
    let cohortFilter = req.query.cohort
    let sortingFilter = req.query.orderBy
    let direction
    // let filterUrl

    // Assign correct values based on chosen sorting option
    switch (sortingFilter) {
        case "name-AZ":
            sortingFilter = "name"
            direction = "ASC"
            break;

        case "name-ZA":
            sortingFilter = "name"
            direction = "DESC"
            break;
    }

    // Assign correct values based on chosen role filter
    switch (roleFilter) {
        case "student":
            roleFilter = "student"
            break;

        case "lecturer":
            roleFilter = "lecturer"
            break;

        case "co_teacher":
            roleFilter = "co_teacher"
            break;
    }

    let squadUrl = urlSquad + slug

    // API call for fetching data based on chosen filters
    const data = await dataFetch(squadUrl)

    // Generate a random number for each member to use as fake data for public repos
    data.squad.members.forEach(member => {
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    res.render('squads', data)
})

// Test using filter() method
app.get('/members', async (req, res) => {

    // Base url for API call
    const testUrl = "https://whois.fdnd.nl/api/v1/members?first=100"

    // API call for fetching data
    const data = await dataFetch(testUrl)

    // Filter data for members based on chosen filters
    const dataDisplay = data.members.filter((eventData) => {

        // console.log(req.query)
        // console.log(eventData)
        console.log(req.query.squad)
        console.log(req.query.role)
        console.log(req.query.cohort)

        let squadFilterCheck
        let roleFilterCheck
        let cohortFilterCheck

        if (req.query.squad) {
            squadFilterCheck = eventData.squads[0].slug.toLowerCase().includes(req.query.squad.toLowerCase())
        }

        if (req.query.role) {
            roleFilterCheck = eventData.role.includes(req.query.role.toLowerCase())
        }

        if (req.query.cohort) {
            cohortFilterCheck = eventData.squads[0].cohort.toLowerCase().includes(req.query.cohort.toLowerCase())
        }

        // If squad filter is used return eventData
        // if (req.query.squad && eventData.squads[0].slug.toLowerCase().includes(req.query.squad.toLowerCase())) {
        //     return eventData
        // }

        // If role filter is used return eventData
        // if (req.query.role && eventData.role.includes(req.query.role.toLowerCase())) {
        //     return eventData
        // }

        // If cohort filter is used return eventData
        // if (req.query.cohort && eventData.squads[0].cohort.toLowerCase().includes(req.query.cohort.toLowerCase())) {
        //     return eventData
        // }

        // return

        // If-ception
        // If all filters are set
        if (req.query.squad && req.query.role && req.query.cohort && squadFilterCheck && roleFilterCheck && cohortFilterCheck) {
            return eventData
        }

        // If squad filter & role filter is set
        if (req.query.squad && req.query.role && squadFilterCheck && roleFilterCheck && !req.query.cohort) {
            return eventData
        }

        // If squad filter & cohort filter is set
        if (req.query.squad && req.query.cohort && squadFilterCheck && cohortFilterCheck && !req.query.role) {
            return eventData
        }

        // If role filter & cohort filter is set
        if (req.query.role && req.query.cohort && roleFilterCheck && cohortFilterCheck && !req.query.squad) {
            return eventData
        }

        // If squad filter is set
        if (req.query.squad && squadFilterCheck && !req.query.role && !req.query.cohort) {
            return eventData
        }

        // If role filter is set
        if (req.query.role && roleFilterCheck && !req.query.squad && !req.query.cohort) {
            return eventData
        }

        // If cohort is set
        if (req.query.cohort && cohortFilterCheck && !req.query.squad && !req.query.role) {
            return eventData
        }

        return
    })

    dataDisplay.forEach(member => {
        // Random number generator
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    res.render('members', {dataDisplay})
})

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
})

async function dataFetch(url) {
    const data = await fetch(url)
        .then((response) => response.json())
        .catch((error) => error)

    return data
}