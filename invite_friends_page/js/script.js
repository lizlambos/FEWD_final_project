$(document).ready(function(){
	
  //initialize parse//

  Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL"); 

    // Load the SDK asynchronously
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



    window.fbAsyncInit = function() {

      // init the FB JS SDK
      Parse.FacebookUtils.init({
      appId      : '254848478004741', // Facebook App ID
      channelUrl : 'http://studio.generalassemb.ly/FEWD20/Liz_Lambos/FEWD_final_project/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow Parse to access the session
      xfbml      : true,  // parse XFBML
      frictionlessRequests : true
    });

     // $(document).ready(function(){
  
//INITIALIZE NODE

YUI().use('node', function (Y) {

  friendListColumn1 = Y.one("#fb-column1");

  //INITIALIZE PARSE  

  Parse.$ = jQuery;

  user = Parse.User.current();
  console.log(user);
  var bird = user.get("username");
  console.log(bird);

  function populateFriendList () {

    FB.api('/me/friends', { fields : 'id, name, picture, email'
  }, function(response) { 
    if (!response.error) {
     var FBArray = response.data;
     console.log(FBArray);  
     var numFriends = FBArray.length;
     console.log(numFriends);


     for (var i=0, l=response.data.length; i<l; i++) {
      friend = response.data[i];
      fbFriendName = friend.name;
      friendID = friend.id;
      friendEmail = friend.email;
      console.log(friendEmail);
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

}//if not error

else {
  console.log("Oops something went wrong with getting your friends from facebook.");
}

});//fb api


  }//populate friend list


  populateFriendList();


  $(".fb_friendsarea").on("click", ".add-friend-button",function(){
        FB.ui({method: 'apprequests',
        appId: '254848478004741', 
        message: 'Dying to know how friends perceive you? Join Karma Police and find out!',
        filters: 'app_non_users',
        //redirect_uri: 'http://studio.generalassemb.ly/FEWD20/Liz_Lambos/FEWD_final_project/login_page/',
        title: 'KarmaPolice - An anonymous read on your karma'
    });

  })


});//node

//});//document ready

    }

});//document ready