$(function(){

  YUI().use('node', function (Y) {

    var KarmaQuery, 
    maQuery,
    activeQueryList,
    privateQueryList,
    myQueriesList,
    prevQueryContainer
    ;

    var user = "default";
    var askerName = "default";
    var questionText = "default";
    var privacyLevel = "default";
    var timeStamp = "default";
    //var karmaPointsBalance = 0;
    //var friendsInvitedBalance = 0;
    //var answersGivenBalance = 0;
    //var answersGottenBalance = 0;



    Parse.$ = jQuery;

    Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");   

    var user = Parse.User.current();

    var KarmaQuery = Parse.Object.extend("KarmaQuery");


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

function getKarmaPoints () {

  //find total answers given

  var QueryAnswer = Parse.Object.extend("QueryAnswer");
  query = new Parse.Query(QueryAnswer);
  query.equalTo("answerer", user);

  query.find({
    success: function(results) {
      console.log(results.length);
      answersGivenBalance = results.length;
      user.set("answersGivenBalance", answersGivenBalance);
      user.save();
    },

    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }

  })//answers given

  //find total answers recieved by returning all query id's asked by user
  
  var KarmaQuery = Parse.Object.extend("KarmaQuery");
  aGQuery = new Parse.Query(KarmaQuery);

  aGQuery.equalTo("asker", user);

  //reset karmaPointsBalance to 0 

  aGQuery.find({
    success: function(results1) {
      console.log(results1.length);

        //reset answersGottenBalance to 0 
        answersGottenBalance = 0;
        user.set("answersGottenBalance",answersGottenBalance);
        user.save();

        Y.Array.each(results1, function(val, i, arr) {
          var answersGotten = val.get("responderCount");
          answersGottenBalance += answersGotten;
          user.set("answersGottenBalance", answersGottenBalance);
          user.save();
          console.log(answersGottenBalance);
        });

        },//success

        error: function(error) {
          alert("Error: " + error.code + " " + error.message);

        }

      });//find

  friendsInvitedBalance = 0;

  user.set("friendsInvitedBalance", friendsInvitedBalance);
  user.save();

  var bears = user.get("friendsInvitedBalance");
  console.log(bears);

  /*(karmaPointsBalance = (
    user.get("answersGivenBalance") - 
    user.get("answersGottenBalance"))
  + user.get("friendsInvitedBalance");

  console.log(karmaPointsBalance);

  user.set("karmaPointsBalance", karmaPointsBalance);
  user.save();

  var mears = user.get("karmaPointsBalance");
  console.log(mears);


user.save(null, {
  success: function(user) {

  },
  error: function(user, error) {
    console.log("Oops, something went wrong saving your karmapoints.");
  }
});
*/ 


}//get karmapoints balance


//translate FBlogin generated username into a real username

$("#fb_login_button").click(function(){

 Parse.FacebookUtils.logIn(null, {
  success: function(user) {
    if (!user.existed())
    {
      setKPUserName();
      getFriends();
      getPhoto();
      getKarmaPoints();
      console.log("User signed up and logged in through Facebook!");
      
            // If it's an existing user that was logged in, we welcome them back
          }
          else {
           getFriends();
           getPhoto();
           getKarmaPoints();
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





});//node

});//document ready