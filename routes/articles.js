const express = require('express')
//Import article model
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req,res) => {
    res.render('articles/new', {article: new Article() })
})

router.get('/edit/:id', async (req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', {article: article })
})

//This is going to be asynchronus
router.post('/', async (req, res, next) => {
   req.article = new Article()
   next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
 }, saveArticleAndRedirect('new'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path){
    return async (req, res) => {
          //create new article pass in every different option
    
    let article = req.article
        //req.body access anything in New Article Form
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

    try{
        //if it works update the article
        //This will save the new article
       article =  await article.save()
       //redirect user to article/id
       res.redirect(`/articles/${article.slug}`)

    } catch(e){ //if fails
        //pass in article that was there before and prefill different fields
        res.render('articles/${path}', { article: article})
    }

    }
}



module.exports = router