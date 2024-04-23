const express = require("express")

const app = express()
const port = 3000;
const hostname = '127.0.0.1';




//Vs 2.0 add css file
const path = require('path');
app.use(express.static(path.join(__dirname, 'styles')));

//method to create your own template engine
const fs = require('fs');
app.engine("lab", (filepath, options, callback) => {
    fs.readFile(filepath, (err, content) =>{
        if (err) return callback(err);

        const rendered = content
            .toString()
            .replaceAll("#title#", `${options.title}`)
            .replace("#content#", `${options.content}`)

        return callback(null, rendered);
    })
})
app.set("views", "./views");
app.set("view engine", "lab");


//Route to the home page
app.get("/", (req,res) =>{
    const options = {
        title: "Home Page",
        content: "This is the content of our home page. \
        Here is the link to register: \
        <a href ='/register'>Register</a>"
    };
    
    res.render("index", options);
})

//Route to the register page
app.get("/register", (req,res) =>{
    const options = {
        title: "Registration Page",
        content: "This is the content of our registration page. \
        Here is the link to register: \
        <a href ='/about'>About</a>"
    };
    
    res.render("register", options);
})


//Route to the about page
app.get("/about", (req,res) =>{
    const options = {
        title: "About User",
        content: "This is the content of our website for username. \
        <a href= '/'>Home</a>"
    };
    
    res.render("about", options);
})

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

//get parameters from form
app.post("/register", (req, res) => {
    const username = req.body.username; 
    const email = req.body.email;
    res.send(`Username: ${username}, Email: ${email}`);
    console.log(`${username} and ${email}`)
})

//download image by click on the button
app.get('/download',function(req,res) {
    console.log('download file');
     
    res.download("./img/meditation.jpg", (error) => {
        console.log("Error : ", error)
    })
})


// Page not found
app.use((req, res, next)=>{
    res.status(404).send('<h1> Page not found </h1>');
    next();
 });

app.listen(port, ()=> {
    console.log(`Server listening on port: http://${hostname}:${port}/`);
})