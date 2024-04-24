const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");


// find a specific user's posts 
router
  .get('/userId/:userId', (req, res) => {
    let filteredPosts = posts.filter(p => p.userId == req.params.userId)
    res.json(filteredPosts)
  })


router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    //GET /api/posts?userId=<VALUE>
    const userId = req.query.userId;
    if (userId) {
      const userPosts = posts.filter(post => post.userId == userId); // Filter posts by userId
      if (userPosts.length > 0) {
          res.status(200).json(userPosts);
      } else {
        res.status(404).send('No posts found for this user.');
      }
    }

    else {
    res.json({ posts, links });}
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

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

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    console.log('Hello!')
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        console.log('this match')
        console.log(posts[i]);
        console.log(req.body);
        for (const key of Object.keys(req.body)) {
          posts[i][key] = req.body[key];
          console.log(key);
        }
        console.log(posts[i]);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });


//Retrieves comments made by the user with the specified id.
// Retrieves comments made by the user with the specified id on the post with the specified postId.

const comments = require("../data/comments");

router.get('/:id/comments', (req, res) => {
  const postId = req.params.id;

  const userId = req.query.userId;
  // console.log(userId);
  
  let commentsByPostId = comments.filter(c => c.postId == postId);
  // console.log(commentsByPostId);
  if (commentsByPostId.length > 0) {
      if (userId) {
        let commentsByPostIdAndUserID = commentsByPostId.filter(c => c.userId == userId);
        // console.log(commentsByPostIdAndUserID);
        if (commentsByPostIdAndUserID.length > 0) {
          res.status(200).json(commentsByPostIdAndUserID);
        }
        else { console.log('No comments found for this post and user.')}
      }
      else 
      res.status(200).json(commentsByPostId);
  } else {
      res.status(404).send('No posts found for this user.');
  }
});


module.exports = router;
