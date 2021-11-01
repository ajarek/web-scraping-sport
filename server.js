const axios =require('axios')
const cheerio =require('cheerio')
const express =require('express')
const {port} =require('./config')
const app= express()
const articles = []

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
const URL = 'https://tvn24.pl'

axios(URL)
    .then(res => {
        const htmlData = res.data
        const $ = cheerio.load(htmlData)
        

        $('.link__content', htmlData).each((index, element) => {
            const title = $(element).children('.news-of-the-day__link').attr('title')
            const titleURL = $(element).children('.news-of-the-day__link').attr('href')
            
            
            if(title&&titleURL){
            articles.push({
                title,
                titleURL,  
            })
        }
        })
       
      
    }).catch(err => console.error(err))
app.get('/',(req,res)=>{
    res.render('index',{resources:articles})
})
app.listen(port,()=>{
    console.log(`start backend port:${port}`);
})

