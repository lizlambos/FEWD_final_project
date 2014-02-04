$(document).ready(function(){
	
//INITIALIZE NODE

YUI().use('node', function (Y) {

	friendListColumn1 = Y.one("#fb-column1");

  //INITIALIZE PARSE  

  Parse.$ = jQuery;

  Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX",
  	"mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");  


  user = Parse.User.current();
  console.log(user);

  function populateFriendList () {


  	FB.api('/me/friends', { fields : 'id, name, picture, email'
  }, function(response) { 
  	var FBArray = response.data;
  	console.log(FBArray);	
  	var numFriends = FBArray.length;
  	console.log(numFriends);
  	

  	for (var i=0, l=response.data.length; i<l; i++) {
  		friend = response.data[i];
  		fbFriendName = friend.name;
  		friendID = friend.id;
  		console.log(fbFriendName);
  		friendPicLink = friend.picture.data.url;
  		//var friendExists = 0;
  
  		
  		//check if friend is an existing user of KarmaPolice
  		function checkIfUserExists () {

  			console.log(friendID);
  			console.log(fbFriendName);

  			var queryID = friendID;
  			var queryName = fbFriendName;
  			var friendPicURL = friendPicLink;

  			var userQuery = new Parse.Query(Parse.User);
  			userQuery.equalTo("fbID", queryID);
  			userQuery.find({
  				success: function(results) {
  					var friendExists = results.length;
  					console.log(queryID);
  					console.log(friendExists);
  					console.log(queryName);
  					var visibleState = "";

  					if (friendExists != 0) {
  						visibleState = "hidden";
  						console.log(visibleState);
  						var content = Y.Lang.sub
  						(Y.one('#fb_friends_invite_list').getHTML(), {
  							id: queryID,
  							friendName: queryName,
  							friendPicURL: friendPicURL,
  							visibleState: visibleState

  				});//content

  						friendListColumn1.prepend(content);
  						

  					}
  					else {
  						visibleState = "monkey";
  						console.log(visibleState);
  						var content = Y.Lang.sub
  						(Y.one('#fb_friends_invite_list').getHTML(), {
  							id: queryID,
  							friendName: queryName,
  							friendPicURL: friendPicURL,
  							visibleState: visibleState

  				});//content

  						friendListColumn1.prepend(content);
  						
  					}

  				},
  				error: function(object, error) {
  					//alert("Error when checking for friend ID: " + error.code + " " + error.message);
  				}
  		});//find

  	}//check if user exists

  	checkIfUserExists();


 }//for

});//fb api

 
  }//populate friend list

   
   populateFriendList();




});//node

});//document ready