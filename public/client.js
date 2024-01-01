
let user = {};
function switchToPatreon(){
    let req = new XMLHttpRequest();
    document.getElementById("right").remove();
    window.location.href = "http://localhost:3000/home"
    req.open('GET', '/toPatreon' ,true);
    req.setRequestHeader('Accept', 'application/json');
    req.send();
}
function switchToArtist(){
    let req = new XMLHttpRequest();
    req.open('GET', '/toArtist' ,true);
    req.setRequestHeader('Accept', 'application/json');
    req.onreadystatechange = function() {
     let newUser = JSON.parse(req.response);
        console.log(newUser.isArtist);

        if(newUser.ArtworksLength==0){
            console.log(1);
            console
            window.location.href = 'http://localhost:3000/addArt';
        }
        else{
            console.log(2);
            window.location.href = 'http://localhost:3000/home';
        }
        }
    document.getElementById('right').style.display = 'block';
    
    req.send();
}
function login(){
    let req = new XMLHttpRequest();
        user.username = document.getElementById("username").value;
        user.password= document.getElementById("password").value;
        
        console.log(req);   

        req.onreadystatechange = function(){
            console.log(this.status);

        if(this.readyState==4&&this.status == 401){
            alert("some user is alrady logged on")
            
        }
        else if (this.readyState==4 && this.status == 204){
            alert("user created");
            window.location.href = "http://localhost:3000/home";  
        }else if(this.readyState==4&& this.status == 403){
            alert("Account exists, password is incorrect, retry please")
        }
       else if (this.readyState==4&&this.status == 200){
            alert('account found');
            window.location.href = "http://localhost:3000/home";  
        }
        }

    req.open('POST', `/login`, true);
    req.setRequestHeader('Content-Type', 'application/json');
    
console.log(JSON.stringify(user));
req.send(JSON.stringify(user));
}
function loadArtist(){
    let req = new XMLHttpRequest();
    let artistName = document.getElementById("artworkArtist").innerHTML;

    req.open('GET', `/artist/${artistName}`, true);
    req.setRequestHeader('Content-Type', 'application/json');
    
req.send(JSON.stringify({artistName: artistName}));
}
function loadMedArt(){
    let req = new XMLHttpRequest();
    let artworkID = window.location.pathname.split('/')[2];
    console.log(req);        
    let medium = document.getElementById("artworkMedium") .value;
        req.open('GET', "/artwork/" + artworkID, true);
        req.setRequestHeader('Content-Type', 'application/json');
    
req.send(JSON.stringify(medium));
}
function addLike(){
    let req = new XMLHttpRequest();
    let title = document.getElementById("title").innerText;
    

    console.log(title);
    let artoworkLikesCount = Number(document.getElementById("artworkLikes").innerText);
    artoworkLikesCount += 1;
    document.getElementById("artworkLikes").innerText= artoworkLikesCount;

    req.open('POST', "/addLike", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({title}));
 }
 function addReview(){
    let req = new XMLHttpRequest();
    let title = document.getElementById("title").innerText;
    console.log(title);
    console.log(document.getElementById("artworkReviews").innerHTML)
    let userReview = document.getElementById('userReview').value;
    document.getElementById("artworkReviews").innerHTML+=userReview;
    document.getElementById("artworkReviews").innerHTML+='<br></br>';
    console.log(userReview);
req.onreadystatechange = function(){

}
    req.open('POST', "/addReview", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({title: title, review:userReview }));
 }
 function loadArtwork(){
    let req = new XMLHttpRequest();
    let artworkID = window.location.pathname.split('/')[2];
    console.log(artworkID);
    console.log(req);
    console.log(this);
    req.onreadystatechange = function(){
    if (req.readyState==4&&this.status ==203) {
        console.log("in your own arts");
        console.log(document.getElementById('likeAndReview'));
        document.getElementById('likeAndReview').remove();
    }

}
    req.open('GET', "/artwork/" + artworkID, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
}
 function removeReview(){
    let req = new XMLHttpRequest();
    let title = document.getElementById("reviewedPost").textContent;
    console.log(title);
    let userReview = document.getElementById('usersReview').textContent;
    document.getElementById("reviewedPost").remove();
    document.getElementById('usersReview').remove();
    document.getElementById('removeReview').remove();
    console.log(userReview);
 
    req.open('DELETE', "/removeReview", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({title: title, review:userReview }));
 }
 function removeLike(){
    let req = new XMLHttpRequest();
    let title = document.getElementById("likedPost").textContent;
    console.log(title);
    document.getElementById("likedPostDiv").remove();

 
    req.open('DELETE', "/removeLike", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({title: title }));
 }
function loadCatArts(){
    let req = new XMLHttpRequest();
    let artworkID = window.location.pathname.split('/')[2];
    let category = document.getElementById("artworkCategory") .value;
    req.open('GET', "/artwork/" + artworkID, true);
    req.setRequestHeader('Content-Type', 'application/json');
    
req.send(JSON.stringify(category));
}
function logout(){
    let req = new XMLHttpRequest();
    window.location.href = "http://localhost:3000/login";  
    req.open('GET', `/logout`, true);
    req.setRequestHeader('Content-Type', 'application/json');
}
function searchItem(){
    console.log("searching..");
    req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			console.log("Response Text: " + this.responseText);
			document.getElementById("results").innerHTML = this.responseText;

		}
	}
    let values = {}
	values.artist = document.getElementById("artist").value;
    values.title =  document.getElementById("title").value;
    values.category =  document.getElementById("category").value;

	
	let queries = [];
	for(key in values){
		console.log(key);
		if(values[key].length != 0){
			queries.push(key + "=" + values[key]);
		}
	}
	let queryString = queries.join("&");
	console.log("QueryString: " + queryString);
	
	req.open("GET", `http://localhost:3000/artworks?${queryString}`);
	req.send();
}
function enroll(){
    workshop = {};
    
    let req = new XMLHttpRequest();
    workshop.Title = document.getElementById("artistWorksop").innerHTML;
    console.log(document.getElementById("artistWorksop").innerHTML);
    req.open("POST", "/enroll", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(workshop));

}
function artistFollowed(){
    let req = new XMLHttpRequest();
    let artistName = document.getElementById("artistName").innerHTML;
    console.log(artistName);
    req.open("POST","/follow", true );
    req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify({atistName:artistName}));
}
function addArt() {
    let artwork = {};
    let req = new XMLHttpRequest();
    console.log(req);
    artwork.Title = document.getElementById("newtitle").value;
    artwork.Year = document.getElementById("newyear").value;
    artwork.Category = document.getElementById("newcategory").value;
    artwork.Medium = document.getElementById("newmedium").value;
    artwork.Description = document.getElementById("newdescription").value;
    artwork.Poster = document.getElementById("newposter").value;
    window.location.href = "http://localhost:3000/home"
        console.log(artwork);
    req.open("POST", `/addArt`, true);
    req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify(artwork));
    req.onreadystatechange = function(){
        let artworksDiv = document.getElementById("artworksDiv");
        let newArtworkLink = document.createElement("a");
        newArtworkLink.href = this.responseText;
        newArtworkLink.textContent = artwork.Title;
        artworksDiv.appendChild(newArtworkLink);
        let newLine = document.createElement("br");
        artworksDiv.appendChild(newLine);
        window.location.href = this.responseText;
    }
    
}
function addWorkshop(){
    let workshop = {};
    let req = new XMLHttpRequest();
    workshop.Title = document.getElementById("workshopTitle").value;
    req.onreadystatechange = function(){
        let workshopsDiv = document.getElementById("workshopsDiv");
        let newWorkshopItem = document.createElement("a");
        newWorkshopItem.setAttribute('href', "/workshop/" + workshop.Title);
        newWorkshopItem.textContent = workshop.Title;
        workshopsDiv.appendChild(newWorkshopItem);
        let newLine = document.createElement("br");
        workshopsDiv.appendChild(newLine);
        
    }
    req.open("POST", `/addWorkshop`, true);
    req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify(workshop));
}
function unFollow(){
    let req = new XMLHttpRequest();
    console.log(document.getElementById("artworkArtist").innerText);
    let artist = document.getElementById("artworkArtist").innerText;
    document.getElementById("artworkArtist").remove();
    document.getElementById("unFollow").remove();
    req.open('DELETE', "/unFollow", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({artist: artist}));
}