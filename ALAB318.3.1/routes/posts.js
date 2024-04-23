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



// GET /api/posts?userId=<VALUE>
// Retrieves all posts by a user with the specified postId.
// It is common for APIs to have multiple endpoints that accomplish the same task. This route uses a "userId" query parameter to filter posts, while the one above uses a route parameter.
// router 
// .get('/', (req, res) => {
//   debugger
//   if (!req.query.userId) {
//       return res.status(400).json({ error: "UserId parameter is required" });
//   }

//   const filteredPosts = posts.filter(p => p.userId === req.query.userId);
//   if (filteredPosts.length === 0) {
//       return res.status(404).json({ error: "No posts found for the given userId" });
//   }

//   res.json(filteredPosts);
// });


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

    res.json({ posts, links });
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

module.exports = router;
