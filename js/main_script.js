$(document).ready(function(){


    var KarmaQuery, 
      maQuery,
      activeQueryList,
      privateQueryList;

  var user = "default";
  var askerName = "default";
  var questionText = "default";
  var privacyLevel = "default";

      

  Parse.$ = jQuery;

  Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");   

  var user = Parse.User.current();

  KarmaQuery = Parse.Object.extend("KarmaQuery");

  


/*Query Object Model

var KarmaQuery = Parse.Object.extend("KarmaQuery");
var karmaQuery = new KarmaQuery();
karmaQuery.set = ("asker", user);
karmaQuery.set = ("text", questionText);
karmaQuery.set = ("privacy-level", privacyLevel);
karmaQuery.set = ("yesAnswers", totalYesAnswers);
karmaQuery.set = ("noAnswers", totalNoAnswers);
karmaQuery.set = ("responders", responders); //responder array
//object ID, created at and updated at are generated automatically

newQuery.save(null, {
  success: function(karmaQuery) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + karmaQuery.id + 'by' + karmaQuery.user +
    	'at' + karmaQuery.createdAt);

  },
  error: function(karmaQuery, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
  }
});

//Query Collection Model

// friendsactive queries collection
var faQuery = new Parse.Query(karmaQuery);
faQuery.notEqualTo("privacy-level", "private");
faQuery.notEqualTo("asker", user);
var friendsActiveQueries = faQuery.collection();

//users own active queries collection
var maQuery = new Parse.Query(karmaQuery);
maQuery.notEqualTo("privacy-level", "private");
maQuery.equalTo("asker", user);
var myActiveQueries = maQuery.collection();

//users private queries collection
var mpQuery = new Parse.Query(karmaQuery);
mpQuery.equalTo("privacy-level", "private");
mpQuery.equalTo("asker", user);
var myPreviousQueries = mpQuery.collection();*/

//getting the karmapoints balance as a variable to be stored

/*function askQuestion () {

    createOnEnter: function(e) {
      var self = this;
      if (e.keyCode != 13) return;

      this.todos.create({
        content: this.input.val(),
        order:   this.todos.nextOrder(),
        done:    false,
        user:    Parse.User.current(),
        ACL:     new Parse.ACL(Parse.User.current())
      });

      this.input.val('');
      this.resetFilters();
    },



}

function updateKarmaQueries () {

    this.karmaQuery.query = new Parse.Query(karmaQuery);
    this.karmaQuery.query.equalTo("user", Parse.User.current());


  
}

// functions to get users facebook id, friends and picture via graph API


function setKPUserName() {
  FB.api('/me', function(response) {
    if (!response.error) {
      var userName = response.name;
      console.log(userName);
      user.set("username", userName);  
      user.save(null, {
        success: function(user) {

        },
        error: function(user, error) {
          console.log("Oops, something went wrong saving your name.");
        }
      });

    } 
    else {
      console.log("Oops something went wrong with facebook.");
    }
  });

}

//how can I fire this on the right page??

function getPhoto()
{
  FB.api('/me/picture?type=normal', function(response) {

    var str= response.data.url;
    console.log(str);
    user.set("userPic", str);
    var userPic = user.get("userPic");
    console.log(userPic);
    user.save(null, {
        success: function(user) {

        },
        error: function(user, error) {
          console.log("Oops, something went wrong saving your name.");
        }
      });

  });

 } 

// Got the array of their facebook friends, need to save as an array


function getFriends() {
  FB.api('/me/friends', function(response) {
    if(response.data) {
     var friendsArray = response.data; 
     console.log(friendsArray);
     user.set("fbFriends", friendsArray);
     var currUserFriends = user.get("fbFriends");
     console.log(currUserFriends);
     $.each(response.data,function(index,friend) {
      //console.log(friend.name + ' has id:' + friend.id);
   
    });
   } else {
    console.log("Error!");
  }
});
}


//translate FBlogin generated username into a real username

$("#fb_login_button").click(function(){

 Parse.FacebookUtils.logIn(null, {
  success: function(user) {
    if (!user.existed())
    {
      console.log("User signed up and logged in through Facebook!");
      
            // If it's an existing user that was logged in, we welcome them back
          }
          else {
            console.log("User logged in through Facebook!");

          }
        },

        error: function(user, error) {
         console.log("User cancelled the Facebook login or did not fully authorize."); }

       });


  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      setKPUserName();
      getFriends();
      getPhoto();
      
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      Parse.FacebookUtils.logIn();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      Parse.FacebookUtils.logIn();
    }
  });

   //redirect to the next page - dont know how to do this without killing function//
     // window.location.href = '../get_karma_page/index.html';



});//end button click function


/*function populateFriendList () {

	FB.api('/me/friends', { fields : 'id', offset : 0, limit : 25 }, function(response) { 

	 var outstring = '<p>Friends:</p>';
       for (var i=0, l=response.data.length; i<l; i++) {
         var friend = response.data[i];
         outstring = outstring + '<fb:profile-pic uid="' + friend.id + '"  width="50" height="50" ></fb:profile-pic>' 
		                        + '<fb:name uid="' + friend.id + '"></fb:name>&nbsp;&nbsp;&nbsp;'
       }
       document.getElementById('myFriendList').innerHTML = outstring; 
       FB.XFBML.parse(document.getElementById('myFriendList'));

   };
   */

//Generate users of Karma Police who are also their facebook friends




//Create different data types stored to the user object





 /*//generate new query

var user = Parse.User.current();
 
// Make a new post
var Post = Parse.Object.extend("Post");
var karmaQuery = new Post();
post.set("asker", user);
post.set("text", "This is some great content");
post.set("karmaQueryID", "My New Post");
post.set("timeStamp","now");
post.set("answerer", answerer.username)
post.save(null, {
  success: function(post) {
    // Find all posts by the current user
    var query = new Parse.Query(Post);
    query.equalTo("user", user);
    query.find({
      success: function(usersPosts) {
        // userPosts contains all of the posts by the current user.
      }
    });
  }
});



 function getUserInfo() {
        FB.api('/me', function(response) {
          var name = response.name;
          var id = response.id;
          //document.getElementById("status").innerHTML=str;
            console.log(name); 
    }
    )}



    function getPhoto()
    {
      FB.api('/me/picture?type=normal', function(response) {
 
          var pic ="<img src='"+response.data.url+"'/>";
          document.getElementById("user_FB_pic").innerHTML+=pic;
 
    });


});*/

/*not sure how sheets read scripts written on html doc
*/



/* what user data looks like

{ "session_token": "wnc5c6b44m7n2fk74ul4hujuk", 
"auth_data": { 
  "facebook": { 
    "id": "605697", 
    "access_token": "CAADnyIkAxgUBAFBK6p9y56VcC7ZBI7z47hPjvXMZBEEkFRhSTyC9GQBETuApRO86Mh7B42OoujNPadcVeHJg39rn5sF7rZBT5zth120ij7Egxxz7ZB9kCw77EdPzKyDiBs4AyM9feUO3pmRhFcJLvZCL65Qcq35hPOIyR2RZA0ofUIBV0ae5iGrjrPShYcrIbBRMJEiXTYbKbDk1jRQ7h2yAODOas7Bb4ZD", 
    "expiration_date": "2014-03-21T21:01:32.915Z" 
    } 
  }, 
"id": "r9dVzEko4H", 
"data": { 
  "username": "yklsuokr249gaysqkgo4rqozg" }, 
  "created_at": "2014-01-20T21:01:35Z", 
  "updated_at": "2014-01-20T21:01:35Z" }*/


//create new query 





});