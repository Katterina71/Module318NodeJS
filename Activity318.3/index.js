const express = require('express')
const app = express();
const port = 3000;



const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

const err = require('./utilities/error')


app.use(express.json())

app.use(postRoutes);
app.use(userRoutes);


app.get('/', (req, res) => {
    res.send('Hello! (from Server)');
})


//error
app.use((req, res, next)=> {
    const time = new Date();

    console.log(
      `-----
  ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
    );
    if (Object.keys(req.body).length > 0) {
      console.log("Containing the data:");
      console.log(`${JSON.stringify(req.body)}`);
    }
    next();
})

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
    console.log();
  let key = req.query["api-key"];

  // Check for the absence of a key.
  if (!key) next(error(400, "API Key Required"));

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Use our Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
    ],
  });
});


// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.

// 404 Middleware
app.use((req, res, next) => {
    next(error(404, "Resource Not Found"));
  });

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
  });

  
app.listen(port, ()=> {
    console.log(`Listening on port: ${port}`);
})