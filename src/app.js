const express = require('express')
const path = require('path')
const hbs = require('hbs')
const { restart } = require('nodemon')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { resetWatchers } = require('nodemon/lib/monitor/watch')


const app = express()
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine' , 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
 
app.use(express.static(publicDirectory)) 

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather through hbs',
        name: 'Shreevara'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me through hbs',
        name: 'I am Shreevara'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'NEED HELP??',
        name: 'I am Shreevara'
    })
})


app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "provide the address"
        })
    }

    geocode(req.query.address, (error, {latitude,longitude,location}={}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address

            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: "provide search term"
        })
    }
    
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "404",
        name: 'shreevara',
        errorMessage: 'HELP NOT FOUND'
    })
})

app.get('/*', (req, res) => {
    res.render('404', {
        title: "404",
        name: 'shreevara',
        errorMessage: 'NOT FOUND'
    })
})



app.listen(3000, () =>{
    console.log('server is up on 3000')
})
