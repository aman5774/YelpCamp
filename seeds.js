var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    { 
        name: "Granite Hill", 
        image: "https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg",
        description: "This is a huge granite hill, no bathrooms. No water . Beautiful granite."
        
    },
    { 
        name: "Desert Mesa", 
        image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg",
        description: "Feel the heat."
        
    },
    { 
        name: "Cloud's rest", 
        image: "https://farm7.staticflickr.com/6085/6037590541_19248d41f0.jpg",
        description: "Cloud's rest camping is one of the best."
        
    }
];
    
function seedDB(){
    
    //Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    
                    //add few comments
                    Comment.create(
                        {
                            text : "This place is good, but I wish there was internet",
                            author : "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        }
                    );
                }
            });
        });
        
        
    });
    
    
}

module.exports = seedDB;
