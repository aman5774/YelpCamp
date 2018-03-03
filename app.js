var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

mongoose.Promise = global.Promise;

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost/yelp_camp_v3", {useMongoClient: true});

seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - displays all the campgrounds
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("index",{campgrounds:allCampgrounds});
        }
    })
});

// CREATE - creates the new campground
app.post("/campgrounds", function(req , res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description:description};
    
    Campground.create(newCampground , function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

// SHOW - shows details about specific campground
app.get("/campgrounds/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server started ...");
});