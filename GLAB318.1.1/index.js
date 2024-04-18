const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

// Define your routes
const routes = {
    '/': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1 style="color: grey">Hello, this is the homepage!</h1>');
    res.end();
    },
    '/about': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<h1 style="color: blue">About page!</h1>');
    res.end();
    },
    '/contact': (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write('<h1 style="color: green">Contact page</h1>');
      res.end();
    }
  };
  
  const server = http.createServer((req, res) => {
    const routeHandler = routes[req.url];
    if (routeHandler) { 
      routeHandler(req, res);
    } else {   
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
 
// const server = http.createServer((req,res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-type', 'text/plain');
//     res.end('Hello World!\n');
// })

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.write('<h1 style="color: red">Hello World!</h1>');
//     res.write('<p>I wonder what else we can send...</p>');
//     res.end();
//   });

server.listen(port, hostname,() => {
    console.log(`Server running at http://${hostname}:${port}/`)
})






