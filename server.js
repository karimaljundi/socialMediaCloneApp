const express = require("express");
const artwork = require("./models/artwork");
const users = require("./models/user");
const mongoose = require("mongoose");
const session = require('express-session'); 
const user = require("./models/user");
const app = express(); 

const MongoDBStore = require('connect-mongodb-session')(session); 
const gallary = new MongoDBStore({ 
    uri: 'mongodb://127.0.0.1:27017/gallary', 
    collection: 'sessiondata' 
}); 
app.use(session({
	secret: 'some secret here',
	//cookie: {maxAge:50000},  //the cookie will expire in 50 seconds
	resave: true,
	saveUninitialized: true,
	
	gallary: gallary
}));


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.get("/", sendIndex);
app.post("/login",login );
app.get("/logout", logout); 
app.get("/artwork/:artworkID", sendArtwork);
app.get("/workshop/:workshopTitle", sendWorkshop);
app.get("/artworks", parseQuery, loadArtworks, sendCards);
app.get("/artist/:artistName", loadArtist);
app.get("/category/:categoryName",findAllCategory );
app.get("/medium/:mediumName", findAllMedium);
app.get("/toPatreon", toPatreon);
app.get("/toArtist", toArtist);
app.get("/info", getUserPage);
app.delete("/unFollow", unFollow);
app.delete("/removeReview", removeReview);
app.delete("/removeLike", removeLike);
app.post("/addArt", addArt);
app.post("/addWorkshop", addWorkshop);
app.post("/enroll", enrollUser);
app.post("/follow", addFollower);
app.get("/allArt", showAllArt);
app.get("/addArt", renderAddArt);
app.get("/home", sendHomepage);
function sendHomepage(req, res, next){
	res.render("index");
}
function renderAddArt(req, res, next){
	res.render("addArt");
}
async function toArtist(req, res, next){
	console.log("changing to Artist...");
	let changed = await users.findOne({username: req.session.username});
	console.log(changed);
	console.log(changed.artworks.length);
	res.send({ArtworksLength: changed.artworks.length, isArtist: true});
}
async function toPatreon(req, res, next){
	console.log("changing to Patreon...");
	console.log(req.body)
	let changed = await users.findOneAndUpdate({username: req.session.username}, {$set: {isArtist: false}});
	console.log(changed);
	res.render("index");
}
async function enrollUser(req, res, next){
	console.log(req);
	let found =await users.findOneAndUpdate({username: req.session.username}, {$push: {enrolledWorkshops: req.body}});
	console.log("enrolled");
}
async function removeLike(req, res,next){
	console.log("removing Like");
	console.log(req.body);
	const findArt = await artwork.findOneAndUpdate({Title: req.body.title}, {$inc: {Likes: -1}}, {new:true});
	const findUser = await users.findOneAndUpdate(
		{username: req.session.username},
		{$pull: {likedPosts: findArt}}
	   
	   
);
	console.log(findUser);
}
async function removeReview(req, res,next){
	console.log("removing review");
	console.log(req.body);
	const findArt = await artwork.findOneAndUpdate({Title: req.body.title}, {$pull: {Reviews: req.body.review}});
	const findUser = await users.findOneAndUpdate(
		{username: req.session.username},
		{$pull: {reviews: {review: req.body.review.review, post: req.body.review.post}}}
	   
	   
);
	console.log(findUser);
}
async function showAllArt(req, res, next){
		console.log("finding all arts");
	const findAll = await artwork.find({Artist:{$ne: req.session.username }});
	console.log(findAll);
	res.render("artworkList", {artworks: findAll});
}
async function addArt(req, res, next){
	console.log("adding art...");
	console.log(req.session);
	let newArtWork = {Title: req.body.Title, Artist: req.session.username, Year: req.body.Year, Category: req.body.Category, 
	Medium: req.body.Medium, Description: req.body.Description, Poster: req.body.Poster}
	let newArt = await artwork.findOneAndUpdate({ Title: newArtWork.Title }, 
		newArtWork, 
		{ upsert: true, new: true });
		console.log("newArt is: " + newArt);
	let updatedUser = await users.findOneAndUpdate({username: req.session.username}, {$push: {artworks: newArt}, $set: {isArtist: true}}, {new: true});
	let newNoti = await users.updateMany({followingArtists: {$elemMatch: {Artist: req.session.username}}}, {$push: {notifications: {notification:`${req.session.username} has added a new artwork: ${newArtWork.Title}`}}});

	console.log("updatedUser: " + updatedUser);
	console.log("new noti: " + newNoti);
	const artUrl = `/artwork/${newArt._id}`;
	console.log(artUrl);
	res.send(artUrl);
}
async function addWorkshop(req, res, next){
	console.log("adding workshop...");
	console.log(req.session);
	let workshopObject = {Title: req.body.Title}
	let newWorkshop = await users.findOneAndUpdate({ username: req.session.username }, {$push: {workshops: workshopObject}});
	let newNoti = await users.updateMany({followingArtists: {$elemMatch: {Artist: req.session.username}}}, {$push: {notifications: {notification:`${req.session.username} has added a new workshop: ${workshopObject.Title}`}}});

}
async function unFollow(req, res, next){
	console.log(req.body);
	let findUser = await users.findOneAndUpdate({username: req.session.username},{$pull:{followingArtists: {Artist:req.body.artist}}});
	console.log(findUser);
	console.log("unFollowed");
}
async function getUserPage(req, res, next){
	const findUser = await users.findOne({username: req.session.username});
	console.log("load user page"); 
	console.log(findUser);
	res.render("user", {users: findUser});
}


app.get('/search', function(req, res) {
	res.render('search');
});
app.post('/addLike',addLike); 
async function addLike(req, res, next){
	let title = req.body.title;
	const findArtwork = await artwork.findOneAndUpdate({Title: req.body.title}, {$inc: {Likes: 1}});
	const findUser = await users.findOneAndUpdate({username: req.session.username},{$push: {likedPosts: findArtwork}} );
   }
   app.post('/addReview',addReview); 
async function addReview(req, res, next){
	console.log("ended findUser");
	console.log(req.body);
			const findArtwork = await artwork.findOneAndUpdate({Title: req.body.title} ,{$push: {Reviews: req.body.review}});

			const findUser = await users.findOneAndUpdate({username: req.session.username}, {$push: {reviews: {review: req.body.review, post: findArtwork}}});
			console.log("ended after finding and updating user");
			
			console.log("found artwork and updated");
   }
   
function parseQuery(req, res, next) {
	console.log("Parse Query")
	let matches = [];
	if (req.query.artist) {
		matches.push({Artist:{ "$regex": ".*" + req.query.artist + ".*", "$options": "i" } });
	}if (req.query.title) {
		matches.push({Title:{ "$regex": ".*" + req.query.title + ".*", "$options": "i" } });
	}if (req.query.category) {
		matches.push({Category:{ "$regex": ".*" + req.query.category + ".*", "$options": "i" } });
	}
	
	let queryDoc;
	matches.push({Artist: {$ne: req.session.username}});
	if (matches.length> 0){
		queryDoc = { "$and": matches };

	}else{
		query = {};
	}
	req.queryDoc = queryDoc;
	next();
}

async function findAllMedium(req, res, next){

	const found = await artwork.find({Medium: req.params.mediumName});
	res.render("artworkList", {artworks: found});
}
async function findAllCategory(req,res, next){
	const found = await artwork.find({Category: req.params.categoryName});
	console.log(found);
	res.render("artworkList", {artworks: found});
}
async function loadArtist(req,res, next){
	console.log(req);
	let found = await users.findOne({username: req.params.artistName});
	res.render("artist", {artist: found, });
}
async function addFollower(req, res, next){
	console.log("adding follower");
	console.log(req.body);
	await users.findOneAndUpdate({username: req.session.username} , {$push: {followingArtists:{Artist: req.body.atistName}}})
}

async function loadArtworks(req, res, next){
	console.log("loadArtWorks");
	let query = req.queryDoc;
	console.log("Query" + JSON.stringify(req.queryDoc));
	const artworkResults = await artwork.find(query);

	res.results = artworkResults;
	console.log("cardResults" + artworkResults)
	next();
}
function sendCards(req, res, next) {
	console.log("Send Artworks");
	res.status(200).render("artworkList", { artworks: res.results });
}
async function sendWorkshop(req, res, next){
	
		let id = req.params.workshopTitle;
		console.log("Send Workshop");
		console.log(id);
		let query = { "enrolledWorkshops": { $elemMatch: { "Title" : id } } };
		console.log("id query" + req.params.workshopTitle);
	
		const result = await users.find(query);
		
		// const workshops = result.workshops;

		// const foundWorkshop = workshops.find(workshop=> workshop.Title === id);

		// console.log(foundWorkshop);

			res.render("workshop", {users:result, title: id});
		
	
}
async function sendArtwork(req, res, next) {
	let id = req.params.artworkID;
	console.log("Send Artwork");
	console.log(id);
	let query = { "_id": id }
	console.log("id query" + req.params.artworkID);
	const sameUser = await artwork.findOne({Artist: req.session.username});
	const result = await artwork.findOne(query);

	console.log(result);
	if (result.Artist === req.session.username){
		console.log("in your own artwork");
		res.status(203);

	}else{
		console.log("in someoneelse's artwork");
		res.status(201);
	}
	res.render("artwork", {artwork:result});
	console.log("end of sendArtwork");
}


function sendIndex(req, res, next) {
	console.log("getUser");
	let username = req.body.username;
	let password = req.body.password;

	let user = {
		username: username,
		password: password
	}
	res.status(200).render("login", {user: user});
}

//authorization function
async function login(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;

	let newUser ={
		username: username,
		password: password,
		isArtist: false,
		followingArtists: [],
		likedPosts : [],
		artworks: [],
		reviews: [],
		notifications: [],
		workshops: [],
		enrolledWorkshops: []
	};


		const findUser = await users.findOne({username: newUser.username});
		const foundAccount = await users.findOne({username: newUser.username, password: newUser.password});
		console.log("find" + findUser);
		if (req.session.loggedin) {
			console.log("sessionID" + req.sessionID);
			res.status(401).send();
			console.log("some user is already logged on");	
			return;
		}
		else if(!findUser) {
			await users.collection.insertOne(newUser);	
			req.session.username = username;
			req.session.loggedin = true;
			console.log("user created");		
			console.log("sessionID" + req.sessionID);
			res.status(204).send();
			console.log(req.session);	
			}
			else if (findUser && !foundAccount){
				console.log("Account exists, password is incorrect");
				res.status(403).send();
			}
		else {
			console.log('account found');

			req.session.username = username;
			req.session.loggedin = true;
			res.status(200).send();
			console.log("sessionID" + req.sessionID);
			console.log(findUser);
			console.log(req.session);				
			}			  
		req.session.save(function(err){
			if (err) return next(err);	
			})
			return
 }
//If the username and password match somebody in our database,
// then create a new session ID and save it in the database.
//That session ID will be associated with the requesting user.



function logout(req, res, next) {
	
	console.log("running logged out...");
	console.log(req.session);
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;

		res.status(200).render("login");
		console.log("logged out");
		console.log(req.session);

	} else {
		res.status(401).send();
		console.log("not logged out");
		console.log(req.session);
	}
	req.session.save(function (err) {
		if (err) next(err)
		
	  })
	
}




mongoose.connect('mongodb://127.0.0.1:27017/gallary');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
app.listen(3000);
console.log("Server listening on port 3000");
