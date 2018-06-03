var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//INDEX - displays all the campgrounds
router.get("/", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

// CREATE - creates the new campground
router.post("/", function(req , res){
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
    });
});

//NEW - show form to create new campground
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows details about specific campground
router.get("/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;