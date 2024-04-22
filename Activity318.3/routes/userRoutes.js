const express = require('express')
const router = express.Router()

const users = require('../data/users');


router
    .route('/')
    .get((req, res) => {
        res.json(users);
    })
    .post((req, res)=> {
       
            if (req.body.name && req.body.username && req.body.email) {
                const foundUser = users.find((u) => u.username == req.body.username)
              if (foundUser) {
                res.json({ error: "Username Already Taken" });
                return;
              }
        
              const user = {
                id: users[users.length - 1].id + 1,
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
              };
        
              users.push(user);
              res.json(users[users.length - 1]);
            } else res.json({ error: "Insufficient Data" }); 
});



router
    .route('/:id')
    .get((req, res, next) => {
    const user = users.find((user)=> user.id == req.params.id);
    if (user) {
        res.json(user);
     }
    else {
        next()
    }
    })

    .patch((req, res) => {
        const user = users.find((p,i) => {
            if (p.id == req.params.id) {
                for (const key in req.body){
                    users[i][key]=req.body[key]
                }
                return true;
            }
        });
        if (user) res.json(user);
        else next();
    })

    .delete((req, res) => {

        const user = users.find((p,i) => {
            if (p.ide == req.params.id) {
                users.slice(i,1);
                return true;
            }
        });
        if (user) res.json(user);
        else next();
    })

    module.exports = router;