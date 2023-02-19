import express from 'express'
import bodyParser from 'body-parser'

const urlMember = "https://whois.fdnd.nl/api/v1/"
const urlSquad = "https://whois.fdnd.nl/api/v1/squad/"

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {

    const addonUrl = urlMember + "members?first=100"
    const data = await dataFetch(addonUrl)
    
    data.members.forEach(member => {
        // Random number generator
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    res.render('index', { data })
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

    // Construct correct API url based on chosen filters

    // Check if role or cohort filters are being used
    // if (roleFilter == undefined && cohortFilter == undefined) {
    //     filterUrl = urlSquad + slug  + '?orderBy=' + sortingFilter + '&direction=' + direction
    // } else if(roleFilter !== undefined && cohortFilter == undefined){
    //     filterUrl = urlMember + "members?first=100" + '&role=' + roleFilter + '&orderBy=' + sortingFilter + '&direction=' + direction
    // } else if(roleFilter == undefined && cohortFilter !== undefined){
    //     filterUrl = urlMember + "members?first=100" + '&cohort=' + cohortFilter + '&orderBy=' + sortingFilter + '&direction=' + direction
    // } else if(roleFilter !== undefined && cohortFilter !== undefined){
    //     filterUrl = urlMember + "members?first=100" + '&role=' + roleFilter + '&cohort=' + cohortFilter + '&orderBy=' + sortingFilter + '&direction=' + direction
    // }

    let squadUrl = urlSquad + slug

    // API call for fetching data based on chosen filters
    const data = await dataFetch(squadUrl)

    // Generate a random number for each member to use as fake data for public repos
    data.squad.members.forEach(member => {
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    res.render('squads', data);
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