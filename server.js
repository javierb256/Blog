const express = require('express');
//create a article router connecting routes with articles.js
const mongoose = require('mongoose')
//grab Article modle
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', { 
    useNewUrlParser: true, useUnifiedTopology: true,  
})

//set the view engine to ejs
//ejs then converted to js code
app.set('view engine', 'ejs')

// access the different parameters from the new article form inside of the article route
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    //grab all articles on the db and sorts them by descending order
    const articles = await Article.find().sort({
        createdAt: 'desc' })
    //will render the index.ejs file from articles folder
    //passes in an articles object to be rendered on index.js
    res.render('articles/index', {articles: articles })
})

//every article create will be added to /articles
app.use('/articles', articleRouter)

//listen port to run page
app.listen(5000)