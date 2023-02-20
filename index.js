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
        // console.log(eventData.role)

        // If no squad filter is chosen, check if role filter is chosen. Else, check if squad filter matches with data
        if (!req.query.squad) {
            // If no role filter is chosen, check if cohort filter is chosen. Else, check if role filter matches with data
            if (!req.query.role) {
                // If no cohort filter is chosen, return all data. Else, check if cohort filter matches with data
                if (!req.query.cohort) {
                    return eventData;
                }else if (eventData.squads[0].cohort.toLowerCase().includes(req.query.cohort.toLowerCase())) { 
                    return eventData;
                }
            } else if (eventData.role.includes(req.query.role.toLowerCase())) {
                return eventData;
            }
        } else if (eventData.squads[0].slug.toLowerCase().includes(req.query.squad.toLowerCase())) {
            return eventData;
        }
    })

    dataDisplay.forEach(member => {
        // Random number generator
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    res.render('members', {
        dataDisplay
    })
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