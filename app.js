var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description : String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create(
    { 
        name: "Granite Hill", 
        image: "https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg",
        description: "This is a huge granite hill, no bathrooms. No water . Beautiful granite."
        
    }, function(err, campground){
    if(err){
        console.log(err);
    } else{
        console.log(campground);
    }
});*/


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
    Campground.findById(req.params.id, function(err, foundCampground){
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