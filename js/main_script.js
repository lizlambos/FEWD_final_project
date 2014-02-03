$(function(){

//INITIALIZE NODE

YUI().use('node', function (Y) {

  //INITIALIZE PARSE  

  Parse.$ = jQuery;

  Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");  

  //VARIABLE DECLARATIONS 

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

    //FROM ME PAGE

    myQueriesList = Y.one(".past_queries_section");
    activeQueryList = Y.one('#active_past_queries_list'),
    privateQueryList = Y.one('#private_past_queries_list');
    prevQueryContainer = Y.one(".previous_query_wrapper");

    var responderCount;

    //FROM GET KARMA PAGE

    friendQueryColumn1 = Y.one("#friends_active_queries_list .friends_queries_section1");
    friendQueryColumn2 = Y.one("#friends_active_queries_list .friends_queries_section2");
    friendQueryColumn3 = Y.one("#friends_active_queries_list .friends_queries_section3");
    allKPQueryColumn1 = Y.one("#allKP_active_queries_list .friends_queries_section1");
    allKPQueryColumn2 = Y.one("#allKP_active_queries_list .friends_queries_section2");
    allKPQueryColumn3 = Y.one("#allKP_active_queries_list .friends_queries_section3");
    friendsActiveQueryList = Y.one('#friends_active_queries_list'),
    allKPActiveQueryList = Y.one('#allKP_active_queries_list');
    QueryContainer = Y.one(".content_component_container");
    
    //FROM ORIGINAL MAIN PAGE

    var user = Parse.User.current();

    var KarmaQuery = Parse.Object.extend("KarmaQuery");


//FUNCTIONS

// functions to get users facebook id, friends and picture via graph API

function setKPUserName() {
  FB.api('/me', function(response) {
    if (!response.error) {
      var userName = response.name;
      console.log(userName);
      user.set("username", userName); 
      var userFbID = response.id;
      console.log(userFbID);
      user.set("fbID", userFbID); 
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


//LOGIN FUNCTION - TO BE FIXED 

function initiateFBLogin() {

  Parse.FacebookUtils.logIn(null, {
    success: function(user) {
      if (!user.existed())
      {
        setKPUserName();
     // getFriends();
         getPhoto();
        
       
    

      //other function which has a tour
      console.log("User signed up and logged in through Facebook!");
      
            // If it's an existing user that was logged in, we welcome them back
          }
          else {
           //setKPUserName();
           //getFriends();
           //getPhoto();
       
           console.log("User logged in through Facebook!");

         }
       },

       error: function(user, error) {
         console.log("User cancelled the Facebook login or did not fully authorize."); }

       });


//prompt for login if not connected

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

      var testy = user.get("username");
      console.log(testy);
      

      redirect();

      
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      Parse.FacebookUtils.login();
        location.reload(true);
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      Parse.FacebookUtils.login();
        location.reload(true);
    }
  });



}//initiate FB login

//redirect to the next page

function redirect()
{
  window.location.href='../get_karma_page/index.html';
}

function redirect2()
{
  window.location.href='../login_page/index.html';
}



$("#fb_login_button").click(function(){

 initiateFBLogin();

 //redirect();

// setTimeout('Redirect()', 10000);

/*, function(){
  redirect();
  setTimeout('Redirect()', 50000);
}*/

});

$("#logout_button").click(function(){
  Parse.User.logOut();


}, function(){
  redirect2();
});



//allow the user to change the privacy level of the question via the button

$("#active_past_queries_list, #private_past_queries_list").on("click",".privacy-level .btn", function () {

  $(this).siblings(".btn").removeClass("active");
  $(this).addClass("active");
  newPrivacyLevel = $(this).text();
  console.log(newPrivacyLevel);
  if(newPrivacyLevel =="Private")  {
    $(this).parents(".previous_query_wrapper").prependTo("#private_past_queries_list");
  }
  else {
    $(this).parents(".previous_query_wrapper").prependTo("#active_past_queries_list");
  }

  query = new Parse.Query(KarmaQuery);
  query.get($(this).attr('id'), {
    success: function(item) {
      item.set('privacylevel', newPrivacyLevel);
      item.save();
      console.log(newPrivacyLevel);
      test1 = item.get("privacylevel");
      test2 = item.id;
      console.log(test1);
      console.log(test2);


    },
    error: function(object, error) {
      alert("Error when updating todo item: " + error.code + " " + error.message);
    }

  });//get function 

}); //on function












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