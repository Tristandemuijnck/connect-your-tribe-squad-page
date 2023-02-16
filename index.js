import express from 'express'

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))

const url = "https://whois.fdnd.nl/api/v1/"
const repos = "https://api.github.com/users/"

async function dataFetch(url) {
    const data = await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)

    return data
}

app.get('/', async (req, res) => {

    const addonUrl = url + "members?first=100"
    const data = await dataFetch(addonUrl)

    data.members.forEach(member => {
        console.log(member.gitHubHandle)
    });
    
    res.render('index', { data })
})

app.get('/squad-a', async (req, res) => {

    const addonUrl = url + "squads/squad-a-2022/"
    const data = await dataFetch(addonUrl)

    res.render('index', { data })
})

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
})