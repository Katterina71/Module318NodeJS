const express = require('express')
const router = express.Router()

const posts = require('../data/posts');

router
    .route('/')
    .get((req, res) => {
        res.json(posts);
    })
    .post((req, res)=> {
       
            if (req.body.userId && req.body.title && req.body.content) {
                const foundPost = posts.find((p) => p.username == req.body.username)
              if (foundUser) {
                res.json({ error: "Username Already Taken" });
                return;
              }
        
              const posts = {
                id: posts[posts.length - 1].id + 1,
                userId: req.body.name,
                title: req.body.username,
                content: req.body.email,
              };
        
              posts.push(post);
              res.json(posts[posts.length - 1]);
            } else res.json({ error: "Insufficient Data" }); 
});

router
    .route('/:id')

    .get((req, res, next) => {
    const post = posts.find((post)=> post.id == req.params.id);
    if (post) {
        res.json(post); 
    }
    else {
        next();
    }})

    .patch((req, res, next) => {
        const post = posts.find((p,i) => {
            if (p.id == req.params.id) {
                for (const key in req.body){
                    posts[i][key]=req.body[key]
                }
                return true;
            }
        });
        if (post) res.json(post);
        else next();
    })

    .delete((req, res, next) => {
        const post = posts.find((p,i) => {
            if (p.ide == req.params.id) {
                posts.slice(i,1);
                return true;
            }
        });
        if (post) res.json(post);
        else next();
    })

    module.exports = router;