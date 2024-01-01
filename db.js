const mongoose = require("mongoose");
const artwork = require("./models/artwork");
const user = require("./models/user");
mongoose.connect('mongodb://127.0.0.1:27017/gallary');
const gallary = require("./gallary/gallery.json");
 
artwork.insertMany(gallary)
 .then(async (savedArtworks) => {
 console.log(savedArtworks);
let users = [];

 for (const curr of savedArtworks) {
   let newUser = users.find(newUser => newUser.username === curr.Artist);
   if (!newUser){
    console.log("didnt find user");
     users.push({
       username: curr.Artist,
       artworks: [curr],
       isArtist: true
    });
   } else {
    console.log("found user");
     newUser.artworks.push(curr);
   }
 }
 await user.insertMany(users);
 console.log(users);

});

module.exports = mongoose;
