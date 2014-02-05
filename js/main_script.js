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

  //var user = "default";
  var askerName = "default";
  var questionText = "default";
  var privacyLevel = "default";
  var timeStamp = "default";


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

   // var user = Parse.User.current();


   var KarmaQuery = Parse.Object.extend("KarmaQuery");


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

  var user = Parse.User.current();

  Parse.FacebookUtils.logIn(null, {
    success: function(user) {

      function setKPUserName() {
        FB.api('/me', function(response) {
          if (!response.error) {
            var userName = response.name;
            console.log(userName);
            user.set("username", userName); 
            var userFbID = response.id;
            console.log(typeof userFbID);
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

      }//set name

      function getPhoto(){
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

      } //get photo

      if (!user.existed()) {
        console.log(user.id);
        setKPUserName();
        getPhoto(); 
        user.set("karmaPointsBalance",0);
        user.set("answersGivenBalance",0);
        user.set("answersGottenBalance",0);
        user.set("friendsInvitedBalance",0);
        user.save();
        console.log("User signed up and logged in through Facebook!");
      }

      else {
        console.log(user.id);
        setKPUserName();
        getPhoto();
        console.log("User logged in through Facebook!");
      }
    },

    error: function(user, error) {
     console.log("User cancelled the Facebook login or did not fully authorize."); }

   });


//prompt for login if not connected


FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      console.log(response.status);
      user = Parse.User.current();

      //This is very strange, but if i dont have these tests the redirect will happen without the user being recognized as a parse currrent user
      //with them it keeps looping through until the user is set

      var testy3 = user.id;
      console.log(testy3);
      var testy = user.get("username");
      console.log(testy);


     //redirect();

    } 
    else if (response.status === 'not_authorized') {
       console.log(response.status);
    Parse.FacebookUtils.login();
        //location.reload(true);
      } 

    else {
       console.log(response.status);
    Parse.FacebookUtils.login();
        //location.reload(true);
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

});



//want to recalc karma points balance on logout rather than login

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