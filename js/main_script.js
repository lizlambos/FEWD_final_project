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

    //From GET KARMA PAGE

    name = user.get("username");
    console.log(name);

    var toast = user.get("answersGottenBalance");
    console.log(toast);

    var toast2 = user.get("friendsInvitedBalance");
    console.log(toast2);

    var toast3 = user.get("answersGivenBalance");
    console.log(toast3);

    var karmaPointsBalance = toast3 + toast2 - toast;


//FUNCTIONS

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

  //reset to 0

  answersGivenBalance = 0;
  user.set("answersGivenBalance",answersGivenBalance);
  user.save();

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
  query = new Parse.Query(KarmaQuery);

  query.equalTo("asker", user);

  query.find({
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

  //get friends invited balance (function to be written)

  friendsInvitedBalance = 0;

  user.set("friendsInvitedBalance", friendsInvitedBalance);
  user.save();

  var bears = user.get("friendsInvitedBalance");
  console.log(bears);


}//get karmapoints balance


//LOGIN FUNCTION - TO BE FIXED 

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
           setKPUserName(); 
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
      setKPUserName(); 
      getFriends();
      getPhoto();
      getKarmaPoints();
      
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

//FROM ME PAGE

// coule be kept on that page

var userPic = user.get("userPic");
var userName = user.get("username");

function putUpUserPic () {

  $("#current_user_fbPic").attr("src",userPic);
  console.log(userPic);
  console.log(userName);

};

function grabUserName () {
  $("#current_user_name").html("<p class='user-name'>"+userName+"</p>");
};

putUpUserPic(); 
grabUserName();

    //load the array of recent active and private queries for the user

    function loadMyQueries (queryList, privacylevel1, privacylevel2) {

      KarmaQuery = Parse.Object.extend("KarmaQuery");

      var query1 = new Parse.Query(KarmaQuery);
      query1.equalTo('privacylevel', privacylevel1);

      var query2 = new Parse.Query(KarmaQuery);
      query2.equalTo('privacylevel', privacylevel2);

      var mainQuery = Parse.Query.or(query1, query2);


      mainQuery.equalTo("asker", user);
      mainQuery.ascending("createdAt");

      mainQuery.find({
        success: function(results) {
          console.log(results.length);



      //Append each of the active queries to the active queries list
      Y.Array.each(results, function(val, i, arr) {

        var activeSetter1 = "";
        var activeSetter2 = ""; 
        var activeSetter3 = ""; 

        function setPrivacyLevelButtons () {

          var tester = val.get("privacylevel");
          console.log(tester);  
          if (tester == "All KP") {
            activeSetter1 = "active";
            activeSetter2 = ""; 
            activeSetter3 = ""; 

          }

          else if (tester == "FB Friends") {
            activeSetter1 = "";
            activeSetter2 = "active"; 
            activeSetter3 = ""; 
          }

          else {
            activeSetter1 = "";
            activeSetter2 = ""; 
            activeSetter3 = "active"; 
          }
        };

        setPrivacyLevelButtons();

//retrieve the answers for each query and the rest of hte content

function getQueryAnswers (queryList) { 

  var QueryAnswer = Parse.Object.extend("QueryAnswer");

  yesQuery = new Parse.Query(QueryAnswer);
  yesQuery.equalTo("queryID",val.id);
  yesQuery.equalTo("answer", "yes");

  yesQuery.find({
    success: function(yesResults) {
      var yesResponderCount = yesResults.length;
      console.log(yesResults.length);

                //assign the relevant query the attribute yesresponder count

                var KarmaQuery = Parse.Object.extend("KarmaQuery");

                yQuery = new Parse.Query(KarmaQuery);
                yQuery.get(val.id, {
                  success: function(item) {
                    item.set('yesResponderCount', yesResponderCount);
                    item.save();

                  },
                  error: function(object, error) {
                    alert("Error when updating todo item: " + error.code + " " + error.message);
                  }

                 });//get function

                noQuery = new Parse.Query(QueryAnswer);
                noQuery.equalTo("queryID",val.id);
                noQuery.equalTo("answer", "no");

                noQuery.find({
                  success: function(noResults) {
                    var noResponderCount = noResults.length;
                    var responderCount = yesResponderCount + noResponderCount;

                    console.log(noResults.length);
                    console.log(responderCount);
                    console.log(yesResponderCount);
                    console.log(noResponderCount);
                    console.log(val.id);
                    var percentYesAnswers = Math.round(
                      (yesResponderCount / responderCount)*100);
                    var percentNoAnswers = Math.round(
                      (noResponderCount / responderCount)*100);

                    var KarmaQuery = Parse.Object.extend("KarmaQuery");

                    nQuery = new Parse.Query(KarmaQuery);
                    nQuery.get(val.id, {
                      success: function(item) {
                        item.set('noResponderCount', noResponderCount);
                        item.set('responderCount', responderCount);
                        item.save();

                      },
                      error: function(object, error) {
                        alert("Error when updating todo item: " + error.code + " " + error.message);
                      }

                 });//get function

                    var content = Y.Lang.sub(Y.one('#past_queries_section').getHTML(), {
                      queryText: val.get('text'),
                      timeStamp: val.createdAt,
                      id: val.id,
                      privacylevel: val.get('privacylevel'),
                      active1: activeSetter1,
                      active2: activeSetter2,
                      active3: activeSetter3,
                      percentYesAnswers: percentYesAnswers,
                      percentNoAnswers: percentNoAnswers,
                      responderCount: responderCount

                    });

                    queryList.prepend(content);
                  },
                  error: function(object, error) {
                    alert("Error when updating todo item: " + error.code + " " + error.message);
                  }

      });//no find
},
error: function(object, error) {
  alert("Error when updating todo item: " + error.code + " " + error.message);
}

      });//yes find

  }//get active query answers

  getQueryAnswers(queryList);
  
}); //y Array function

},//success function


});// active query find function

$("#private_past_queries_list").addClass("hidden");


}//loadMyQueries

loadMyQueries(activeQueryList, "All KP", "FB Friends");
loadMyQueries(privateQueryList, "Private", "Private");


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

$("#active_queries").click(function(){
  $(this).addClass("active");
  $("#past_queries").removeClass("active");
  $("#private_past_queries_list").addClass("hidden");
  $("#active_past_queries_list").removeClass("hidden");
  

});

$("#past_queries").click(function(){
  $(this).addClass("active");
  $("#active_queries").removeClass("active");
  $("#private_past_queries_list").removeClass("hidden");
  $("#active_past_queries_list").addClass("hidden");


});


// FROM GET KARMA PAGE

//refresh friends questions in the question area (no filters at this time)    

function loadFriendQueries(contentColumn){

  KarmaQuery = Parse.Object.extend("KarmaQuery");
  User = Parse.Object.extend("User");

  faQuery = new Parse.Query(KarmaQuery);
  faQuery.notEqualTo("privacylevel", "Private");
      //faQuery.notEqualTo("asker", user);
      
      faQuery.include("User");
      faQuery.ascending("createdAt");

      var myActiveQueries = faQuery.collection();
      console.log(myActiveQueries);

      faQuery.find({
        success: function(results) {
          console.log(results.length);

          var asker = "default";
          var askerName = "default";
          var askerPic = "default";
          var askerID = "default";        

  //Append each of the active queries to the active queries list
  Y.Array.each(results, function(val, i, arr) {
    asker = val.get('asker');
    console.log(asker);
    askerID = asker.id;
    console.log(askerID);
    askerName = val.get('askerName');
    console.log(askerName);

  //display the karma points balance on the two scoreboard areas (screen and mobile)  

  $(".row.scoreboard .scoreboard .karma_points_display")
  .html("<span class='badge'>"+karmaPointsBalance+"</span>");

  $(".top-navbar-icon.karma-points .badge")
  .html("<span class='badge'>"+karmaPointsBalance+"</span>");

    //load picture of query asker

    function getAskerPic() {
      query = new Parse.Query(User);
      query.get(askerID, {
        success: function(item) {
          askerPic = item.get('userPic');
          console.log(askerPic);
          
          var content = Y.Lang.sub(Y.one('#friends_queries_section').getHTML(), {
            queryText: val.get('text'),
            timeStamp: val.createdAt,
            askerName: val.get('askerName'),
            id: val.id,
            privacylevel: val.get('privacylevel'),
            askerPicURL: askerPic,
            karmaPointsBal: karmaPointsBalance

          });

          contentColumn.prepend(content);
        },
        error: function(object, error) {
          alert("Error when updating todo item: " + error.code + " " + error.message);
        }

      });

      }//get asker pic about

      getAskerPic();
      
    });//y.array

  }//success

  });//find

}//load friend queries

//calling function on three columns but content is being repeated need to put in more arugments for each query  

loadFriendQueries(allKPQueryColumn1);
loadFriendQueries(allKPQueryColumn2);
loadFriendQueries(allKPQueryColumn3);



//increment answers given and karma points

function incrementScore() {
  user.set("answersGivenBalance", 
    user.get("answersGivenBalance")+1);
  user.save();

  var toast4 = user.get("answersGottenBalance");
  console.log(toast4);

  var toast5 = user.get("friendsInvitedBalance");
  console.log(toast5);

  var toast6 = user.get("answersGivenBalance");
  console.log(toast6);

  var karmaPointsBalance = toast6 + toast5 - toast4;


  $(".row.scoreboard .scoreboard .karma_points_display")
  .html("<span class='badge'>"+karmaPointsBalance+"</span>");

  $(".top-navbar-icon.karma-points .badge")
  .html(karmaPointsBalance);

}//increment score

//two separate functions bount to the answers button being clicked, the first one reveals the answers 

$("#allKP_active_queries_list").on("mouseenter",".answers .btn", function(){

    var queryID = $(this).attr("id");

    //reveal answers

    function revealAnswers(){

      var KarmaQuery = Parse.Object.extend("KarmaQuery");
      getAnswersQuery = new Parse.Query(KarmaQuery);

      getAnswersQuery.get(queryID, {
        success: function(item) {
          noAnswers = item.get('noResponderCount');
          yesAnswers = item.get('yesResponderCount');
          var totalAnswers = noAnswers + yesAnswers;
          //console.log(totalAnswers);
          responders = item.get('responderCount');
          //console.log(responders);

          var percentYesAnswers = Math.round(
            (yesAnswers / responders)*100);

          var percentNoAnswers = Math.round(
            (noAnswers / responders)*100);

          console.log(percentYesAnswers);
          console.log(percentNoAnswers);

          //i dont want to have two click events, but I dont know how to get the html to change otherwise

          $("#allKP_active_queries_list").on("click",".answers .btn", function(){

            $(this).parents(".answers").
            children(".yes-button").html(percentYesAnswers+"%")
            .css({"font-size": "3em", "padding":"25px 7px 30px 7px"});

            $(this).parents(".answers").
            children(".no-button").html(percentNoAnswers+"%")
            .css({"font-size": "3em", "padding":"25px 7px 30px 7px"});

          });

        },
        error: function(object, error) {
          alert("Error when updating todo item: " + error.code + " " + error.message);
        }

});//get function

}//revealanswers

revealAnswers();

}); // end of mouseenter function

$("#allKP_active_queries_list").on("click",".answers .btn", function(){
 var queryID = $(this).attr("id");
 answer = $(this).attr("name");
 user = Parse.User.current();

 function setQueryAnswer() {
  console.log(answer);
  answererName = Parse.User.current().get("username");
  console.log(answererName);
  var d = new Date();
  var dString = d.toString();
  timeStamp = dString.substring(4,11);
  console.log(queryID);

  var QueryAnswer = Parse.Object.extend("QueryAnswer");
  queryAnswer = new QueryAnswer();

  queryAnswer.set("answerer", user);
  queryAnswer.set("answererName", answererName);
  queryAnswer.set("answer", answer);
  queryAnswer.set("queryID", queryID);
  queryAnswer.set("timeStamp", timeStamp);

  queryAnswer.save(null, {
    success: function(queryAnswer) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
      'at' + queryAnswer.createdAt+'.');

  },
  error: function(queryAnswer, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
  }

});

  }//answer questions
  setQueryAnswer();
  incrementScore();

});

  //delete button to hide queries

  $("#allKP_active_queries_list").on("click",".delete-button", function(){
    $(this).parents(".parent_row").addClass("hidden");
  });


 //FROM NEW QUERY PAGE

 function queryCreator () {

  user = Parse.User.current();
  askerName = user.get("username");
  questionText = $("#query_area").val();
  privacyLevel = $("button.active").text();
  var d = new Date();
  var dString = d.toString();
  timeStamp = dString.substring(4,11);
    //yesAnswers = [];
    //noAnswers = [];
    var responderCount = 0;

    KarmaQuery = Parse.Object.extend("KarmaQuery");

    var karmaQuery = new KarmaQuery();

    karmaQuery.set("asker", user);
    karmaQuery.set("askerName", askerName);
    karmaQuery.set("text", questionText);
    karmaQuery.set("privacylevel", privacyLevel);
    karmaQuery.set("timeStamp", timeStamp);

  //karmaQuery.set("yesAnswers", yesAnswers);
  //karmaQuery.set("noAnswers", noAnswers);


  console.log(questionText);
  console.log(privacyLevel);
  console.log(timeStamp);

  var test = karmaQuery.get("askerName");
  console.log(test);
  var test2 = karmaQuery.get("text");
  console.log(test2);
  var test3 = karmaQuery.get("privacylevel");
  console.log(test3);
  console.log(karmaQuery);


  var QueryAnswer = Parse.Object.extend("QueryAnswer");
  answerQuery = new Parse.Query(QueryAnswer);
  answerQuery.equalTo("queryID",karmaQuery.id);
  answerQuery.ascending("createdAt");

  answerQuery.find({
    success: function(totalResults) {
      var responderCount = totalResults.length;
      console.log(totalResults.length);
      console.log(responderCount);
      karmaQuery.set("responderCount",responderCount);
      karmaQuery.save();

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }

  })



//object ID, created at and updated at are generated automatically

karmaQuery.save(null, {
  success: function(karmaQuery) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + karmaQuery.id + 'by' + karmaQuery.authorName +
      'at' + karmaQuery.createdAt+'.');

  },
  error: function(karmaQuery, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
  }
});

}


$("#kp_button").click(function(){
  $(this).toggleClass("active");
  $("#fb_button").removeClass("active");
  console.log(questionText);
  console.log(privacyLevel);


})  ;

$("#fb_button").click(function(){
  $(this).toggleClass("active");
  $("#kp_button").removeClass("active");
  console.log(questionText);
  console.log(privacyLevel);


});

//run query creator on click

$("#submit_button").click(function(){
  queryCreator();
  console.log(user);
  console.log(questionText);
  console.log(privacyLevel);


});

$("#go_button").click(function(){
  queryCreator();
  console.log(user);
  console.log(questionText);
  console.log(privacyLevel);


});



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