const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const {
    port
} = require('./config')
const app = express()
const articles = []

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
const URL = 'https://programtv.onet.pl/kategoria/sport'

axios(URL)
    .then(res => {
        const htmlData = res.data
        const $ = cheerio.load(htmlData)


        const listItems = $("li");

        listItems.each(function (idx, el) {
            const time = $(el).children('.hours').text()
            const title = $(el).children('.titles').text()
            const titleURL = $(el).children('.titles').children('a').attr('href')
           
            if(time&&title&&titleURL){
                articles.push({
                    time,
                    title,
                    titleURL
                })
            }
        })




    }).catch(err => console.error(err))
app.get('/', (req, res) => {
    res.render('index', {
        resources: articles
    })
})
app.listen(port, () => {
    console.log(`start backend port:${port}`);
})