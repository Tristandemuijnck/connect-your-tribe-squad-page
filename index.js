import express from 'express'
import bodyParser from 'body-parser'

const urlMember = "https://whois.fdnd.nl/api/v1/"
const urlSquad = "https://whois.fdnd.nl/api/v1/squad/"
const reposUrl = "https://api.github.com/users/"

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
    let squadUrl = urlSquad + slug

    const data = await dataFetch(squadUrl)

    data.squad.members.forEach(member => {
        member.publicRepos = Math.floor(Math.random() * 20)
    });

    res.render('squads', data);
})

app.post('/filter', async (req, res) => {
    let squadFilter = req.body.squad
    let roleFilter = req.body.role
    let cohortFilter = req.body.cohort
    let sortingFilter = req.body.sorting

    // Check if data is present in checkboxes
    if (req.body.squad !== "") {
        squadFilter = "squad=" + req.body.squad
    }
    if (req.body.role !== ""){
        roleFilter = "role=" + req.body.role
    }
    if (req.body.cohort !== ""){
        cohortFilter = "cohort=" + req.body.cohort
    }
    if (req.body.sorting !== ""){
        sortingFilter = "sorting=" + req.body.sorting
    }

    res.redirect(303, '/FDND?' + squadFilter)
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