import express from 'express'
import bodyParser from 'body-parser'

// Default url for member API call
const urlMember = "https://whois.fdnd.nl/api/v1/"
const city = ['Amsterdam', 'Den-Haag', 'Rotterdam', 'Groningen', 'Utrecht', 'Hilversum', 'Alkmaar', 'Leiden']

// Create a new express app
const app = express()

// Set the view engine of the app to ejs
app.set('view engine', 'ejs')
// Set the location of the views folder
app.set('views', './views')
// Set the location of the public folder with static files
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', async (req, res) => {

    const addonUrl = urlMember + "members?first=100"
    const data = await dataFetch(addonUrl)

    data.members.forEach(member => {
        // Random number generator
        member.publicRepos = Math.floor(Math.random() * 20)
        member.age = Math.floor(Math.random() * 10) + 18
        member.city = city[Math.floor(Math.random() * city.length)]
    });

    console.log(data)

    res.render('index', {data})
})

// Test using filter() method
app.get('/members', async (req, res) => {

    let direction
    let sortingFilter = req.query.orderBy
    let queryData = req.query

    // Base url for API call
    let testUrl = "https://whois.fdnd.nl/api/v1/members?first=100"

    // API call for fetching data
    const data = await dataFetch(testUrl)

    // Filter data for members based on chosen filters
    let dataDisplay = data.members.filter((eventData) => {

        let squadFilterCheck
        let roleFilterCheck
        let cohortFilterCheck

        // Assign checks for correct data to variable for easier use
        if (req.query.squad) {
            squadFilterCheck = eventData.squads[0].slug.toLowerCase().includes(req.query.squad.toLowerCase())
        }

        if (req.query.role) {
            roleFilterCheck = eventData.role.includes(req.query.role.toLowerCase())
        }

        if (req.query.cohort) {
            cohortFilterCheck = eventData.squads[0].cohort.toLowerCase().includes(req.query.cohort.toLowerCase())
        }


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

        // If no filter is set
        if(!req.query.squad && !req.query.role && !req.query.cohort) {
            return eventData
        }

        return
    })

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

    // Sort data based on chosen sorting option
    const sortedData = dataDisplay.sort((a, b) => {
        if (direction === "DESC") {
            return a.name.toLowerCase() <= b.name.toLowerCase() ? 1 : -1
        }else{
            return a.name.toLowerCase() >= b.name.toLowerCase() ? 1 : -1
        }
    })

    dataDisplay.forEach(member => {
        // Random number generator
        member.publicRepos = Math.floor(Math.random() * 20)
        member.age = Math.floor(Math.random() * 10) + 18
        member.city = city[Math.floor(Math.random() * city.length)]
    });

    res.render('members', {sortedData, queryData})
})

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
})

// Api call function
async function dataFetch(url) {
    const data = await fetch(url)
        .then((response) => response.json())
        .catch((error) => error)

    return data
}