const { urlencoded } = require('express')
const express = require('express')
// const mysql = require('mysql')
//setup mongoose db
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

// var connection = mysql.createConnection({
//     host    : 'localhost',
//     user    : 'me',
//     password : 'secret', 
//     database  : 'my_db'
// });

//connect mongoose db and save it to db "blog"
mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')

//Tell app to use
//Saying we can access diff article form options inside article route
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

app.get('/', async (req,res) => {
    //gets all available articles and sorts by newest ones first
   const articles = await Article.find().sort({
       createdAt: 'desc'})
   res.render('articles/index', {articles: articles})
})

app.use('/articles', articleRouter)
   
app.listen(5000)
