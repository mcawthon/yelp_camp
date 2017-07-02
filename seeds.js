var mongoose    = require("mongoose");
var Campground  = require("./models/campground.js");
var Comment     = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://media-cdn.tripadvisor.com/media/photo-s/05/c6/94/80/red-squirrel-campsite.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
];

function seedDB()
{
    Campground.remove({}, function(err) {
        if (err)
        {
            console.log(err);
        }
        console.log("removed campgrounds");
        data.forEach(function(seed) 
        {
            Campground.create(seed, function(err, campground) 
            {
                if (err)
                {
                    console.log(err);
                }
                else 
                {
                    console.log("added a campground");
                    Comment.create({
                        text: "This place is great",
                        author: "Homer"
                    }, function(err, comment) {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                             campground.comments.push(comment);
                             campground.save();
                             console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;