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
      channelUrl : 'http://studio.generalassemb.ly/FEWD20/Liz_Lambos/FEWD_final_project/login_page.html', // Channel File
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

  function move_to_top()
  {
    $(".fb_dialog").each(function(index) {
      if ($(this).css("top")!='-10000px' && $(window).width() > '990' ) {
        $(this).css({"top": "160px"} );
      }
      if ($(this).css("top")!='-10000px' && $(window).width() > '768'  && $(window).width() < '990' ) {
        $(this).css({"top": "150px"} );
      }
      if ($(this).css("top")!='-10000px' && $(window).width() < '768') {

      }
      
    });
    setTimeout( function(){move_to_top()}, 10);
  }

  function send_request()
  {
    FB.Canvas.scrollTo(0,0);
    FB.ui({method: 'apprequests',
        //appId: '254848478004741', 
        message: 'Dying to know how friends really perceive you? Join Karma Police and find out!',
        //filters: 'app_non_users',
        //redirect_uri: 'http://studio.generalassemb.ly/FEWD20/Liz_Lambos/FEWD_final_project/login_page/',
        title: 'KarmaPolice - An anonymous read of your karma'
      });

    $(".fbProfileBrowserResult").ready( function(){
      t = setTimeout ( function(){ move_to_top(); }, 10 );

      
    }); 



  }

  send_request();

// countInvites() {
  user = Parse.User.current();

      user.fetch().then(function(){

        var friendsInvited = user.get("friendsInvitedBalance");
        console.log(friendsInvited);
        var inviteButton = $("._6a._6b  button");
        console.log(inviteButton.length);

        $('body').on("click", ".FB_UI_dialog button", function(){
          friendsInvited ++;
          console.log(friendsInvited);

          user.set("friendsInvitedBalance",friendsInvited);
          user.save({
            success: function(){
              console.log("friends invited saved");
            },
            error: function(){
              console.log("friends invited not saved");
            }
      });//save
    });//onclick

  }); //fetch

   // }

 //countInvites();   
  //$(".fb_friendsarea").on("load",function(){
        //$(this).addClass("active");
        
        

  /*
    var friendEmail = $(this).attr("name");
    var emailSubject = "Check out Karma Police";
    var emailBody = "This app is awesome. It lets you get anonymous feedback from your friends and check out what friends have been trying to find out. It's FREE and you'll get 10 bonus Karma Points for signing up through this link: http://studio.generalassemb.ly/FEWD20/Liz_Lambos/FEWD_final_project/login_page.html "

      $(this).attr('action',
                       'mailto:'+friendEmail+'subject=' +
                       emailSubject + '&body=' + emailBody);
        $(this).submit();

        */

    //});


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

              friendListColumn1.append(content);
              
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


  //populateFriendList();

  //refresh the user's Karma points balance by re-running queries

  function refreshKarmaPoints () {

    var def1 = $.Deferred();
    def1.done(calcKarmaPointsBalance);

    var def2 = $.Deferred();
    def2.done(refreshAnswersGiven);

    var def3 = $.Deferred();
    def3.done(refreshAnswersGotten);


    function calcKarmaPointsBalance ()  {

      console.log("given balance function done");

      Parse.User.current().fetch().then(function (user) {

       var testing1 = user.get("answersGottenBalance");
       console.log(testing1);

       var testing2 = user.get("friendsInvitedBalance");
       console.log(testing2);

       var testing3 = user.get("answersGivenBalance");
       console.log(testing3);

       var karmaPointsBalance = testing3 + testing2 - testing1;
       console.log(karmaPointsBalance);

       // user.set("karmaPointsBalance", karmaPointsBalance);
       user.save( {karmaPointsBalance: karmaPointsBalance}, {
         success: function() {
          console.log(user);

          console.log("saved the new karma points");
          Parse.User.current().fetch().then(function (user) {

            console.log(user.get("karmaPointsBalance"));

          });
        },
        error: function( error) {
          console.log('Failed to create new object, with error code: ' + error.description);
        }

      });

       console.log(karmaPointsBalance);
       Parse.User.current().fetch().then(function (user) {
        var boar = user.get("karmaPointsBalance")
        console.log(boar);

      });

      //display the karma points balance on the two scoreboard areas (screen and mobile)  

      $(".row.scoreboard .scoreboard .karma_points_display")
      .html("<span class='badge'>"+karmaPointsBalance+"</span>");


    });//current user fetch
    } //calc KarmaPointsBalance


      // query answers to get answers given

      function refreshAnswersGiven () {

       console.log("gotten balance function done");

       Parse.User.current().fetch().then(function (user) {

        var QueryAnswer = Parse.Object.extend("QueryAnswer");
        var query = new Parse.Query(QueryAnswer);
        query.equalTo("answerer", user);

        query.find({

          success: function(results) {
            console.log(results.length);
            var answersGivenBalance = results.length;
            console.log(answersGivenBalance);
          //user.set("answersGivenBalance", answersGivenBalance);
          user.save(
            {answersGivenBalance: answersGivenBalance}, {
              success: function() {
                console.log(user.id);
                console.log(answersGivenBalance);
                console.log("ansers given saved");
                console.log(user.get("answersGivenBalance"));
              },
              error: function(error) {
                console.log("answersGiven not saved");
              }
            }).then(function()  {
              def1.resolve();
            });//save

          },
          error: function(error) {
            console.log("not found");
          }

        });  //find

    });//parse current user fetch then

    }//refresh answers given balance

    function refreshAnswersGotten() {

      Parse.User.current().fetch().then(function (user) {

        var QueryAnswer = Parse.Object.extend("QueryAnswer");

        numQuery = new Parse.Query(QueryAnswer);
        numQuery.equalTo("asker", user);
        console.log(user.id);

        numQuery.find({
          success: function(numResults) {
            var totalRespCount = numResults.length;
            console.log(totalRespCount);
            var burntToast = user.get("username");
            console.log(burntToast);
            user.set("answersGottenBalance", totalRespCount);
            user.save( {
              success: function() {
               Parse.User.current().fetch().then(function (user) {
                user.set("answersGottenBalance", totalRespCount);
                console.log("ansers gotten saved");
              //console.log(user.get("answersGottenBalance"));

            });
             },
             error: function(error) {
              console.log("answersGotten not saved");
            }
          }).then(function()  {
            def2.resolve();
          });//save
        },
        error: function(error) {
          console.log("not found");
        }

        });//find

  });//parse current user fetch

    }//refresh friends gotten

    function refreshFriendsInvited()  { 

      Parse.User.current().fetch().then(function (user) {

        friendsInvitedBalance = 0;

        user.set("friendsInvitedBalance", friendsInvitedBalance);
        user.save().then(function(){
          def3.resolve();
        });

    });//parse current user fetch

    }

    refreshFriendsInvited();

}//get karmapoints balance

refreshKarmaPoints();  








});//node

//});//document ready

}

});//document ready