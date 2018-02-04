var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.static("partials"));

var campgrounds = [
        { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        { name: "Granite Hill", image: "https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg"},
        { name: "Mountain Goat's Rest", image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg"},
        { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        { name: "Granite Hill", image: "https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg"},
        { name: "Mountain Goat's Rest", image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg"},
        { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        { name: "Granite Hill", image: "https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg"},
        { name: "Mountain Goat's Rest", image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg"}
    ];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds", function(req , res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server started ...");
});