
const db = require("mongoose");

const artworkSchema =new db.Schema ({
    Title:     { type: String, required:true},
    Artist:      { type: String, required:true},
    Year: { type: String, required:true},
    Category: { type: String, required:true},
    Medium : { type: String, required:true},
    Description: { type: String, required:false},
    Poster: { type: String, required:true},
    Likes: {type: Number, default:0},
    Reviews: {type: Array, default: []}
});

module.exports =db.model("artwork", artworkSchema);

