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
  			var friend = response.data[i];
  			var friendID = friend.id;
  			var fbFriendName = friend.name;
  			console.log(fbFriendName);
  			var friendPicLink = friend.picture.data.url;

  			var content = Y.Lang.sub
  			(Y.one('#fb_friends_invite_list').getHTML(), {
  				id: friendID,
  				friendName: fbFriendName,
  				friendPicURL: friendPicLink
  			
  		});
  			friendListColumn1.prepend(content);

 }//for

});//fb api

  }//populate friend list

populateFriendList();

});//node

});//document ready