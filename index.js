import express from 'express'

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('index')
})

app.set('port', process.env.PORT || 8000)

app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
})