var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

mongoose.Promise = global.Promise;

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelp_camp_v6", {useMongoClient: true});


//Using the temp DB for seeding the application with some data
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"This is yelp camp secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


// Root Route
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - displays all the campgrounds
app.get("/campgrounds", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
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
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows details about specific campground
app.get("/campgrounds/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ======================
// COMMENT Routes
// ======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


// Authentication Routes

//show register form
app.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username:req.body.username});
    
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req , res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
    
});


// logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


//middleware for checking user is logged In or not
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        res.next();
    }
    res.redirect("/login");
}


//===========================
// Starting YelpCamp server
//===========================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server started ...");
});