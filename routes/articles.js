const express = require('express')
//grabs the article schema created in article.js
const Article = require('./../models/article')
const router = express.Router()

//This creates the router you will need to type to get to this page
// a '/' will result in typing /articles to get to the page
// inserting something such as '/test' will make the route /articles/test
router.get('/new', (req, res) => {
    // pass in a new black article when hitting cancel then returning to new article or else will cause an error
    res.render('articles/new', { article: new Article() })
})

//router that allows to edit an article
router.get('/edit/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

//the router will get the article found with its assigned id
//after instead of full id use the shorter slug instead
router.get('/:slug', async (req,res) => {
    //use findOne instead of find since find gives a full array and findOne gives a specific one
    const article = await Article.findOne({slug: req.params.slug})
    //check if article is found if not then redirect to main page
    if(article == null) res.redirect('/');
    //render out page in /show and pass in article just created by quering the db
    res.render('articles/show', {article: article})
})

//router information when posting return to '/'
router.post('/', async (req, res, next) => {
    //creates a new article
    req.article = new Article()
    //next means move on to the next article 
    next()
   //pass in new to the function 
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    //creates a new article
    req.article = new Article().findById(req.params.id)
    //next means move on to the next article 
    next()
   //pass in new to the function 
}, saveArticleAndRedirect('edit'))

//a router that will handle article deletes
//we need an action of our method to do this us method-override
//allows to override the method that the form passes
router.delete('/:id', async (req, res) =>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//combines saving and editing articles
function saveArticleAndRedirect(path) {
    return async (req, res) =>{
        let article = req.article
            article.title = req.body.title,
            article.description = req.body.description,
            article.markdown = req.body.markdown
        try{
            // sets the article variable to the new information retrieved
            article = await article.save()
            // redirects the user to the new aricle using the newly created id
            //after redirect using the slug
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            // when error occurs render back to new article page with the information they have inputted
            res.render(`articles/${path}`, { article: article})
        }
    }
}

//to use the router need to export router from exports.js
module.exports = router