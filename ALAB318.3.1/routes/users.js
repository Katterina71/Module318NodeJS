const express = require("express");
const router = express.Router();

const users = require("../data/users");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

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

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });


 
// GET /api/users/:id/posts
const posts = require('../data/posts');

router.get('/:id/posts', (req, res) => {
  const userId = req.params.id;
  console.log(`Posts for userId: ${userId}`);

  let postsByUserId = posts.filter(post => post.userId == userId);
  console.log(postsByUserId);

  if (postsByUserId.length > 0) {
      res.status(200).json(postsByUserId);
  } else {
      res.status(404).send('No posts found for this user.');
  }
});

//Retrieves comments made by the user with the specified id.
// Retrieves comments made by the user with the specified id on the post with the specified postId.

const comments = require("../data/comments");

router.get('/:id/comments', (req, res) => {

  const userId = req.params.id;
  const postId = req.query.postId;

  // console.log(userId);
  // console.log(postId);
  
  let commentsByUserId = comments.filter(c => c.userId == userId);
  console.log(commentsByUserId);
  if (commentsByUserId.length > 0) {
      if (postId) {
        let commentsByUserIdAndPostID = commentsByUserId.filter(c => c.postId == postId);
        // console.log(commentsByUserIdAndPostID);
        if (commentsByUserIdAndPostID.length > 0) {
          res.status(200).json(commentsByUserIdAndPostID);
        }
        else { console.log('No comments found for this post and user.')}
      }
      else 
      res.status(200).json(commentsByUserId);
  } else {
      res.status(404).send('No posts found for this user.');
  }
});


module.exports = router;
