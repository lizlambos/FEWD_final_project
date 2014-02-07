$(document).ready(function(){

	YUI().use('node', function (Y) {

		friendQueryColumn1 = Y.one("#friends_active_queries_list .friends_queries_section1");
		friendQueryColumn2 = Y.one("#friends_active_queries_list .friends_queries_section2");
		friendQueryColumn3 = Y.one("#friends_active_queries_list .friends_queries_section3");
		allKPQueryColumn1 = Y.one("#allKP_active_queries_list .friends_queries_section1");
		allKPQueryColumn2 = Y.one("#allKP_active_queries_list .friends_queries_section2");
		allKPQueryColumn3 = Y.one("#allKP_active_queries_list .friends_queries_section3");
		friendsActiveQueryList = Y.one('#friends_active_queries_list'),
		allKPActiveQueryList = Y.one('#allKP_active_queries_list');
		QueryContainer = Y.one(".content_component_container");

    Parse.$ = jQuery;

    Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");   

    var user = Parse.User.current();
    console.log(user);
    var toad = user.get('fbID');
    console.log(toad);


      function setKPUserName() {
        FB.api('/me', function(response) {
          if (!response.error) {
            var userName = response.name;
            console.log(userName);
            user.set("username", userName); 
            var userFbID = response.id;
            console.log(typeof userFbID);
            console.log(userFbID);
            var userEmail = response.email;
            console.log(userEmail);
            user.set("email", userEmail);
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


      function getFriends() {
        FB.api('/me/friends', function(response) {
          if(response.data) {
           var friendsArray = response.data; 
           console.log(friendsArray);

           user.set("fbFriends", friendsArray);
           user.save();

           var currUserFriends = user.get("fbFriends");
           console.log(currUserFriends);

         } else {
          console.log("Error!");
        }
      });


}//get friends

    setKPUserName();
    getPhoto();
    getFriends();

    user.fetch();
    /*

    var toast7 = user.get("answersGivenBalance");
    console.log(toast7);//74

    var toast9 = user.get("answersGottenBalance");
    console.log(toast9);//0 post login

    var KPBalance = user.get("karmaPointsBalance");
    console.log(KPBalance);
    */

    //refresh the user's Karma points balance by re-running queries

    function refreshKarmaPoints (user) {

      // query answers to get answers given

      var QueryAnswer = Parse.Object.extend("QueryAnswer");
      query = new Parse.Query(QueryAnswer);
      query.equalTo("answerer", user);

      query.find({

        success: function(results) {
          console.log(results.length);
          var answersGivenBalance = results.length;
          console.log(answersGivenBalance);
          user.set("answersGivenBalance", answersGivenBalance);
          user.save(null, {
            success: function(user) {
               user.set("answersGivenBalance", answersGivenBalance);
              console.log("ansers given saved");
              console.log(user.get("answersGottenBalance"));
            },
            error: function(user, error) {
              console.log("answersGiven not saved");
            }
        });//save

        },
        error: function(error) {
          console.log("not found");
        }

        });  //find


      var toast9 = user.get("answersGivenBalance");
      console.log(toast9);

      //refresh answers given balance

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
          user.save(null, {
            success: function(user) {
              user.set("answersGottenBalance", totalRespCount);
              console.log("ansers gotten saved");
              console.log(user.get("answersGottenBalance"));
            },
            error: function(user, error) {
              console.log("answersGotten not saved");
            }
          });//save

        },
        error: function(error) {
          console.log("not found");
        }

        });//find

      //get friends invited balance (function to be written)

      friendsInvitedBalance = 0;

      user.set("friendsInvitedBalance", friendsInvitedBalance);
      user.save();

}//get karmapoints balance

refreshKarmaPoints(user);  

function calcKarmaPointsBalance ()  {

 // user.fetch();

var testing1 = user.get("answersGottenBalance");
console.log(testing1);//0 before page refresh

var testing2 = user.get("friendsInvitedBalance");
console.log(testing2);

var testing3 = user.get("answersGivenBalance");
console.log(testing3);

var karmaPointsBalance = testing3 + testing2 - testing1;
console.log(karmaPointsBalance);

user.set("karmaPointsBalance", karmaPointsBalance);
user.save(null, {
 success: function(user) {
  user.set("karmaPointsBalance", karmaPointsBalance);
  console.log("saved the new karma points");
  console.log(user.get("karmaPointsBalance"));
},
error: function(user, error) {
  console.log('Failed to create new object, with error code: ' + error.description);
}

});

console.log(karmaPointsBalance);
console.log(user.get("karmaPointsBalance"));

      //display the karma points balance on the two scoreboard areas (screen and mobile)  

      $(".row.scoreboard .scoreboard .karma_points_display")
      .html("<span class='badge'>"+karmaPointsBalance+"</span>");

      $(".top-navbar-icon.karma-points .badge")
      .html("<span class='badge'>"+karmaPointsBalance+"</span>");


    } //calc KarmaPointsBalance

calcKarmaPointsBalance();    

//refresh friends questions in the question area (no filters at this time)    

function loadFriendQueries(contentColumn){

	KarmaQuery = Parse.Object.extend("KarmaQuery");
	//User = Parse.Object.extend("User");

	faQuery = new Parse.Query(KarmaQuery);
	faQuery.notEqualTo("privacylevel", "Private");
  faQuery.notEqualTo("asker", user);

  //faQuery.include("User");
  faQuery.ascending("createdAt");

  var myActiveQueries = faQuery.collection();
  //console.log(myActiveQueries);

  faQuery.find({
   success: function(results) {
    console.log(results.length);

    var asker = "default";
    var askerName = "default";
    var askerPic = "default";
    var askerID = "default"; 
    var askerFbID = "default";


  //Append each of the active queries to the active queries list
  Y.Array.each(results, function(val, i, arr) {
  	asker = val.get('asker');
  	//console.log(asker);
    var questId = val.id;
    console.log(questId);
    askerID = asker.id;
    console.log(askerID);
    askerName = val.get('askerName');
    console.log(askerName);

//load picture of query asker

function getAskerPic() {
 var query = new Parse.Query(Parse.User);
 query.get(askerID, {
  success: function(item) {
   askerPic = item.get('userPic');
   //console.log(askerPic);

         //screen by privacy level 

         var privacySetting = val.get('privacylevel');

         if (privacySetting == "All KP") {

           var content = Y.Lang.sub(Y.one('#friends_queries_section').getHTML(), {
            queryText: val.get('text'),
            timeStamp: val.get('timeStamp'),
            askerName: val.get('askerName'),
            id: val.id,
            privacylevel: "",
            askerID: askerID,
            askerPicURL: askerPic
    				//karmaPointsBal: karmaPointsBalance

    			});

           contentColumn.prepend(content);

         }

         else {

          var askerFbID = item.get('fbID');
          console.log(askerFbID);
          var userFbID = user.get('fbID');
          console.log(userFbID);

          var userFriendsArray = user.get('fbFriends');
          console.log(userFriendsArray);

          function findFriendMatch(friendFbId){
            return $.grep(userFriendsArray, function(n, i){
              return n.id == friendFbId;
            });
          };

          findFriendMatch(askerFbID);  

          if (findFriendMatch(askerFbID) != "") {
            console.log("friends");
            var content = Y.Lang.sub(Y.one('#friends_queries_section').getHTML(), {
              queryText: val.get('text'),
              timeStamp: val.get('timeStamp'),
              askerName: val.get('askerName'),
              id: val.id,
              privacylevel: "",
              askerID: askerID,
              askerPicURL: askerPic
            //karmaPointsBal: karmaPointsBalance

          });

            contentColumn.prepend(content);

          }

          else {

           console.log("not Friends");

           var content = Y.Lang.sub(Y.one('#friends_queries_section').getHTML(), {
            queryText: val.get('text'),
            timeStamp: val.get('timeStamp'),
            askerName: val.get('askerName'),
            id: val.id,
            privacylevel: "hidden",
            askerID: askerID,
            askerPicURL: askerPic
            //karmaPointsBal: karmaPointsBalance

          });

          //filter by privacy level

          contentColumn.prepend(content);

        }

        }//else

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

//display updated Karma point balance

function updateAnswererKarmaPoints() {

  user.fetch();

  refreshKarmaPoints(user);   

}//update karma points




//two separate functions bount to the answers button being clicked, the first one reveals the answers 

$("#allKP_active_queries_list").on("mouseenter",".answers .btn", function(){

	var queryID = $(this).attr("id");

    //reveal answers

    function revealAnswers(){

    	var KarmaQuery = Parse.Object.extend("KarmaQuery");
    	getAnswersQuery = new Parse.Query(KarmaQuery);

    	getAnswersQuery.get(queryID, {
    		success: function(item) {
          item.fetch();
          noAnswers = item.get('noResponderCount');
          yesAnswers = item.get('yesResponderCount');
          var totalAnswers = noAnswers + yesAnswers;
          //console.log(totalAnswers);
          responders = item.get('responderCount');
          //console.log(responders);

          if (responders != 0) {

            var percentYesAnswers = Math.round(
             (yesAnswers / responders)*100);

            var percentNoAnswers = Math.round(
             (noAnswers / responders)*100);

            console.log(percentYesAnswers);
            console.log(percentNoAnswers);

          }

          else {
            var percentYesAnswers = 0;
            var percentNoAnswers = 0;
          }

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

//set uuser answers

$("#allKP_active_queries_list").on("click",".answers .btn", function(){
	var queryID = $(this).attr("id");
	answer = $(this).attr("name");
  var askerId = $(this).parents(".parent_row").children(".friend-name").attr("id");

  console.log(answer);
  user.fetch();
  var answererName = user.get("username");
  console.log(answererName);
  myid = user.id;
  console.log(myid);
  var d = new Date();
  var dString = d.toString();
  timeStamp = dString.substring(4,15);
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

    console.log('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
      'at' + queryAnswer.createdAt+'.');

  },
  error: function(queryAnswer, error) {

    alert('Failed to create new object WOMP WOMP, with error code: ' + error.description);
  }

    });//save

  var KarmaQuery = Parse.Object.extend("KarmaQuery");
  queryAsker = new Parse.Query(KarmaQuery);
  queryAsker.get(queryID, {
    success:function(item) {

      var questAsker = item.get("asker");
      console.log(questAsker.id);

      queryAnswer.set("asker", questAsker);
      queryAnswer.save(null, {
       success: function(queryAnswer) {

        console.log('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
          'at' + queryAnswer.createdAt+'.');

      },
      error: function(queryAnswer, error) {

        alert('Failed to create new object because of asker, with error code: ' + error.description);
      }

    });//save

    },
    error:function(item, error) {
      console.log("problem finding asker");
    }


  }).then(function(){

//update the answers gotten points for the asker DOES NOT WORK

function updateAskerKarmaPoints () {
 console.log(queryID);

  //update the answers the user has given 

  KarmaQuery = Parse.Object.extend("KarmaQuery");
  //User = Parse.Object.extend("User");

  thatAskerQuery = new Parse.Query(KarmaQuery);
  thatAskerQuery.get(queryID, {
   success: function(item1) {
    item1.fetch();
    console.log(item1);
    var personAsking= item1.get("asker");
    console.log(personAsking);
    console.log(personAsking.id);

    var userQuery = new Parse.Query(Parse.User);
    userQuery.get(personAsking.id, {
      success: function(item2) {

        console.log(item2);
        var testing4 = item2.get("answersGottenBalance");
        console.log(testing4);
        console.log("hi this is gil");

        var QueryAnswer = Parse.Object.extend("QueryAnswer");
        query = new Parse.Query(QueryAnswer);
        query.equalTo("answerer", item2);

//then start

query.find({
  success: function(results) {
    console.log(results.length);
    var answersGivenBalance = results.length;
    console.log(answersGivenBalance);
    item2.set("answersGivenBalance", answersGivenBalance);
    item2.save(null, {
      success:function(item2) {
        console.log("saving answersGiven");
      },
      error: function(item2, error) {
        console.log("not saving answersgiven");
      }

    });
    var toast8 = item2.get("answersGivenBalance");
    console.log(toast8);
  },

  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }

}).

then(function(){

//update the responder counts for their questions

function getQueryResponders () { 

  var QueryAnswer = Parse.Object.extend("QueryAnswer");

  numQuery = new Parse.Query(QueryAnswer);
  numQuery.equalTo("asker",item2);
  console.log(item2.id);

  numQuery.find({
    success: function(numResults) {
      var totalRespCount = numResults.length;
      console.log(numResults.length);
      var burntToast = item2.get("username");
      console.log(burntToast);
      item2.set("answersGottenBalance", totalRespCount);
      item2.save(null, {
        success: function(item2) {
          console.log("ansers gotten saved");
        },
        error: function(item2, error) {
          console.log("answersGotten not saved");
        }
        });//save

    },
    error: function(numResults, error) {
      alert("Error when updating todo item: " + error.code + " " + error.message);
    }

});//find function


  }//getquery answers

  getQueryResponders();

}).then(function(){

          //get friends invited balance (function to be written)

          friendsInvitedBalance = 0;

          item2.set("friendsInvitedBalance", friendsInvitedBalance);
          item2.save();

        }).then(function(){

          item2.fetch();

          var testing10 = item2.get("answersGottenBalance");
console.log(testing10);//0 before page refresh

var testing11 = item2.get("friendsInvitedBalance");
console.log(testing11);

var testing12 = item2.get("answersGivenBalance");
console.log(testing12);

var karmaPointsBalance = testing12 + testing11 - testing10;

console.log(item2.id);

item2.set("karmaPointsBalance", karmaPointsBalance);
item2.save(null, {
 success: function(item2) {
  console.log("saved the new karma points");
},
error: function(item2, error) {
  console.log('Failed to save karmapoints ' + error.description);
}

});//person save

console.log(karmaPointsBalance);

});

        //then

      },
      error: function(item2, error) {
        console.log(askerId);
        console.log("cant find ya");
            //alert("Error when checking for friend ID: " + error.code + " " + error.message);
          }
      });//get 2

},
error: function(item1, error) {
  console.log(askerId);
  console.log("cant find ya");
            //alert("Error when checking for friend ID: " + error.code + " " + error.message);
          }
      });//get 1


}//update asker karma points

updateAskerKarmaPoints();

}).then(function(){
  refreshKarmaPoints(user);

});

});//onclick

 //DOES NOT WORK


  //delete button to hide queries

  $("#allKP_active_queries_list").on("click",".delete-button", function(){
  	$(this).parents(".parent_row").addClass("hidden");
  });





});//YUI

});//document.ready