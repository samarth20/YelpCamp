var express=require("express");
var router =express.Router();
var Campground = require("../models/campground");
var middleware=require("../middleware");

//INDEX - show all camps
router.get("/", function(req, res){
    //get all camps from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new camp to db
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to camps array
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var description=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var newCampgorund={name: name, price: price, image: image, description: description, author: author};
    //create a new camp and save to db
    Campground.create(newCampgorund, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to camps page
            console.log(newlyCreated);
            res.redirect("/campgrounds");     
        }
    });
});

//NEW - show form to create new camp
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new"); 
});

//SHOW - shows more info about one camp
router.get("/:id", function(req, res) {
    //find the camp with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that camp
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMP ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});   
    });   
});

//UPDATE CAMP ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect to show page
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY CAMP ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;