var express        = require('express'),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose       = require('mongoose'),
    bodyParser     = require('body-parser'),
    app            = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const PORT = process.env.PORT;

var blogSchema = new mongoose.Schema({
    title: String,
    bodyy: String,
    image: String,
    created: { type: Date, default: Date.now }
  });

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "elephant",
//   body: "This is the body of elephant title",
//   image: "https://cdn.pixabay.com/photo/2016/11/14/04/45/elephant-1822636_960_720.jpg"
// });

app.get("/", function (req, res) {
  res.redirect("/blogs")
});



app.get('/blogs', function(req, res){
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  })
});

app.get("/blogs/new", function(req, res){
  res.render("new");
});

app.post("/blogs", function(req, res) {
  req.body.blog.bodyy = req.sanitize(req.body.blog.bodyy);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render("new");
    } else {
      res.redirect("blogs");
    }
  });
});

app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
})

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
  req.body.blog.bodyy = req.sanitize(req.body.blog.bodyy);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog,function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs");
    }
  })
});









app.listen(PORT, function () {
  console.log("server listening on port 3000");
})
