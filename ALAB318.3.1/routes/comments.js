const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");


router
    .route('/')
    .get((req, res) => {
        console.log('click')
        const links = [
            {
              href: "comments/:id",
              rel: ":id",
              type: "GET",
            },
          ];
        

            //GET /api/posts?userId=<VALUE>
        const userId = req.query.userId;
        const postId = req.query.postId;
        if (userId) {
        const userComments = comments.filter(comment => comment.userId == userId); // Filter posts by userId
        if (userComments.length > 0) {
            res.status(200).json(userComments);
        } else {
            res.status(404).send('No comments found for this user.');
        }
        } else if (postId) {
            const postComments = comments.filter(comment => comment.postId == postId); // Filter posts by userId
            if (postComments.length > 0) {
                res.status(200).json(postComments);
            } else {
                res.status(404).send('No comments found for this user.');
            }
        } else {
        res.json({ comments, links });
    }
    })
    .post((req, res, next) => {
        if (req.body.name && req.body.username && req.body.email) {
          if (comments.find((c) => c.username == req.body.username)) {
            next(error(409, "Username Already Taken"));
          }
    
          const user = {
            id: comments[comments.length - 1].id + 1,
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
          };
    
          comments.push(user);
          res.json(comments[comments.length - 1]);
        } else next(error(400, "Insufficient Data"));
      });

router
      .route('/:id')
      .get((req, res, next) => {
        const comment = comments.find(c => c.id == req.params.id)
        const links = [
            {
              href: `/${req.params.id}`,
              rel: "",
              type: "PATCH",
            },
            {
              href: `/${req.params.id}`,
              rel: "",
              type: "DELETE",
            },
          ];
          if (comment) res.json({ comment, links });
          else next();
      })
      .patch((req,res,next) => {
        const comment = comments.find((c, i) => {
            if (c.id == req.params.id) {
              for (const key in req.body) {
                comments[i][key] = req.body[key];
              }
              return true;
            }
          });
      
          if (comment) res.json(comment);
          else next();
      })
      .delete((req,res,next) => {
        const comment = comments.find((c, i) => {
            if (c.id == req.params.id) {
                comments.splice(i, 1);
              return true;
            }
          });
      
          if (comment) res.json(comment);
          else next();
      })

module.exports = router;
