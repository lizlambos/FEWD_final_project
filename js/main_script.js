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
    
 
  console.log(Parse.User.current());    





     //checkStatus();
      // window.open('https://www.facebook.com/login.php?skip_api_login=1&api_key=254848478004741&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fredirect_uri%3Dhttp%253A%252F%252Fstatic.ak.facebook.com%252Fconnect%252Fxd_arbiter.php%253Fversion%253D40%2523cb%253Df38be48d28%2526domain%253Dmykarmapolice.com%2526origin%253Dhttp%25253A%25252F%25252Fmykarmapolice.com%25252Ff124d93e8%2526relation%253Dopener%2526frame%253Df9feea2a8%26display%3Dpopup%26scope%3Duser_friends%252Cemail%252Cpublish_actions%26response_type%3Dtoken%252Csigned_request%26domain%3Dmykarmapolice.com%26client_id%3D254848478004741%26ret%3Dlogin%26sdk%3Djoey&cancel_uri=http%3A%2F%2Fstatic.ak.facebook.com%2Fconnect%2Fxd_arbiter.php%3Fversion%3D40%23cb%3Df38be48d28%26domain%3Dmykarmapolice.com%26origin%3Dhttp%253A%252F%252Fmykarmapolice.com%252Ff124d93e8%26relation%3Dopener%26frame%3Df9feea2a8%26error%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26e2e%3D%257B%257D&display=popup', "SignIn", "width=780,height=410,toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0");


//LOGIN FUNCTION - TO BE FIXED 

function initiateFBLogin() {

  var user = Parse.User.current();

  var def1 = $.Deferred();
  def1.done(setKPUserName);

  var def2 = $.Deferred();
  def2.done(getPhoto);

  var def3 = $.Deferred();
  def3.done(getFriends);

  var def4 = $.Deferred();
  def4.done(checkStatus);


  function getFriends() {
    FB.api('/me/friends', function(response) {
      if(response.data) {
       var friendsArray = response.data; 
       console.log(friendsArray);

           //user.set("fbFriends", friendsArray);
           user.save({fbFriends: friendsArray}, {
            success: function(user) {

            },
            error: function(user, error) {
              console.log("Oops, something went wrong saving your friends.");
            }
          }).then(function(){
            def4.resolve();
          });

          var currUserFriends = user.get("fbFriends");
          console.log(currUserFriends);

        } else {
          console.log("Error!");
        }
      });


}//get friends

function getPhoto(){
  FB.api('/me/picture?type=normal', function(response) {



    var str= response.data.url;
    console.log(str);

    user.set("userPic", str);

    var userPic = user.get("userPic");
    console.log(userPic);
    user.save( {
      success: function(user) {

      },
      error: function(user, error) {
        console.log("Oops, something went wrong saving your picture.");
      }
    }).then(function(){
      def3.resolve();
    });

  });

      } //get photo

      function setKPUserName() {

        user = Parse.User.current();
        FB.api('/me', function(response) {
          if (!response.error) {
            var userName = response.name;
            console.log(userName);
            //user.set("username", userName); 
            var userFbID = response.id;
            console.log(typeof userFbID);
            console.log(userFbID);
            var userEmail = response.email;
            console.log(userEmail);
            //user.set("email", userEmail);
            //user.set("fbID", userFbID); 
            user.save({username: userName, email: userEmail, fbID: userFbID}, {
              success: function(user) {

              },
              error: function(user, error) {
                console.log("Oops, something went wrong saving your name.");
              }
            }).then(function(){
              def2.resolve();
            });

          } 
          else {
            console.log("Oops something went wrong with facebook.");
          }
        });

      }//set name

      Parse.FacebookUtils.logIn("user_friends,email,publish_actions", {
        success: function(user) {

          if (!user.existed()) {
            console.log(user.id);
        //setKPUserName();
        //getPhoto(); 
        //getFriends();

        user.set("karmaPointsBalance",0);
        user.set("answersGivenBalance",0);
        user.set("answersGottenBalance",0);
        user.set("friendsInvitedBalance",0);
        user.set("hadTour", false);
        user.set("wantsKPWarning", true);
        user.set("wantsFriendsWarning", true);
        user.set("friendsTotal",0);
        user.save().then(function(){
          console.log("User signed up and logged in through Facebook!");
          def1.resolve();

        });

      }

      else {
        console.log(user.id);
        setKPUserName();
        getPhoto();
        getFriends();
        console.log("User logged in through Facebook!");
      }
    },

    error: function(user, error) {

     console.log("User cancelled the Facebook login or did not fully authorize."); 
     //location.reload().then(function(){
      //initiateFBLogin();
     //})
   }
 });


//prompt for login if not connected

function checkStatus()  {


  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    console.log("auth change running");
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;

    if (response.status === 'connected') {
      console.log(response.status);
      user = Parse.User.current();

      //This is very strange, but if i dont have these tests the redirect will happen without the user being recognized as a parse currrent user
      //with them it keeps looping through until the user is set

      var testy3 = user.id;
      console.log(testy3);
      var testy = user.get("username");
      console.log(testy);
      //var val = testy.val();

      var hasNum = testy.match(/\d+/g);
      console.log(hasNum);

      //make sure FB username actually saved and not random number

      if (hasNum === null) {
        redirect();
        
      }

      else {
       Parse.FacebookUtils.login();
     }


   } 
   else if (response.status === 'not_authorized') {
     console.log(response.status);

   } 

   else {
     console.log(response.status);

   }
 });


}//check fb status

}//initiate FB login

//redirect to the next page

function redirect()
{
  window.location.href='../get_karma_page/index.html';
}

$("#fb_login_button").click(function(){
 initiateFBLogin();

 //redirect();

});

function redirect2()
{
  window.location.href='../login_page/index.html';

}









//want to recalc karma points balance on logout rather than login

$("#logout_button, #logout_button_bottom").click(function(){
  Parse.User.logOut();

}, function(){

  redirect2();
});

/*

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