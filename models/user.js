const mongoose = require("mongoose");
const artwork = require("./artwork");
const Schema = mongoose.Schema;


let userSchema  =new mongoose.Schema({
    username: {type: String ,required:true, unique: true},
    password: {type: String ,required:true, default : "createPasswor"},
    isArtist: {type: Boolean, require: true, default: false},
    followingArtists : {type: Array, default: []},
    likedPosts: {type: Array, default: []},
    reviews: {type: Array, default: []},
    artworks: [{
        type: Object
    }],
    notifications: {type: Array, default: null},
    workshops: {type: Array, default: []},
    enrolledWorkshops: {type: Array, default: []}
}, {strict: false}, {typeKey: '$type'});
module.exports =mongoose.model("user", userSchema);
