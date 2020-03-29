var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); //siempre después de bodyparser

//MONGOOSE/MODEL CONFIG
var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }

});

//compilo el esquema en el modelo
var Blog = mongoose.model("Blog", BlogSchema);


/*Blog.create({
   title:"test blog",
   image: "https://i.gyazo.com/533c7e1edf61057a64cde9c12a08964e.jpg",
   body:"hello this is a post"
});*/


//RESTFUL ROUTES

app.get("/", function (req, res) {

    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, allblogs) {
        if (err) {
            console.log("error");
        }
        else {
            res.render("index", { blogs: allblogs });
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    });
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE

app.put("/blogs/:id", function (req, res) {  //id,newdata,callback function
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


//INICIO SERVIDOR

app.listen(process.env.PORT || 3000, function () {
    console.log("server started!");

});

// npm install --save express ejs request body-parser mongoose method-override express-sanitizer