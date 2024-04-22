const express = require("express")
const app = express()
const port = 3000
const hostname = '127.0.0.1';


const fs = require('fs');

app.engine("lab", (filepath, options, callback) => {
    fs.readFile(filepath, (err, content) =>{
        if (err) return callback(err);

        const rendered = content
            .toString()
            .replaceAll("#title#", `${options.title}`)
            .replace("#content#", `${options.content}.`)

        return callback(null, rendered);
    })
})

app.set("views", "./views");
app.set("view engine", "lab");

app.get("/", (req,res) =>{
    const options = {
        title: "Home Page",
        content: "This is the content of our home page. \
        Here is the link to register: \
        <a href ='/register'>Register</a>"
    };
    
    res.render("index", options);
})

app.get("/register", (req,res) =>{
    const options = {
        title: "Registration Page",
        content: "This is the content of our registration page. \
        Here is the link to register: \
        <a href ='/about'>About</a>"
    };
    
    res.render("index", options);
})

app.get("/about", (req,res) =>{
    const options = {
        title: "About Us",
        content: "The end!"
    };
    
    res.render("index", options);
})


app.listen(port, ()=> {
    console.log(`Server listening on port: http://${hostname}:${port}/`);
})