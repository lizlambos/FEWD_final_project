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

    user.fetch();

    var toast7 = user.get("answersGivenBalance");
    console.log(toast7);//74

    var toast9 = user.get("answersGottenBalance");
    console.log(toast9);//0 post login

    var karmaPointsBalance = user.get("karmaPointsBalance");
    console.log(karmaPointsBalance);

    //refresh the user's Karma points balance by re-running queries


    function refreshKarmaPoints (person) {

      // query answers to get answers given

      var QueryAnswer = Parse.Object.extend("QueryAnswer");
      query = new Parse.Query(QueryAnswer);
      query.equalTo("answerer", person);

      query.find({
        success: function(results) {
          console.log(results.length);
          var answersGivenBalance = results.length;
          console.log(answersGivenBalance);
          person.set("answersGivenBalance", answersGivenBalance);
          person.save();

          var toast8 = person.get("answersGivenBalance");
          console.log(toast8);

        },

        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }


  //find total answers recieved by returning all query id's asked by user

  //reset answersGotten calculator placeholder to 0 

}).then(function(){  

  var KarmaQuery = Parse.Object.extend("KarmaQuery");

  query1 = new Parse.Query(KarmaQuery);

  query1.equalTo("asker", person);

  query1.find({
    success: function(results1) {

      console.log(results1.length);
      var answersGottenCalc = 0;
      Y.Array.each(results1, function(val, i, arr) {
        var answersGotten = val.get("responderCount");
        console.log(answersGotten);
        answersGottenCalc += answersGotten;
        console.log(answersGottenCalc);


        var burntToast = person.get("username");
        console.log(burntToast);
        person.set("answersGottenBalance", answersGottenCalc);
        person.save(null, {
          success: function(person) {
            console.log("ansers gotten saved");
          },
          error: function(person, error) {
            console.log("answersGotten not saved");
          }
        });//save
        //console.log(answersGottenCalc);

      });

      },//success

      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);

      }
    })//save

    }).then(function(){

          //get friends invited balance (function to be written)

          friendsInvitedBalance = 0;

          person.set("friendsInvitedBalance", friendsInvitedBalance);
          person.save();

        }).then(function(){

          var testing1 = person.get("answersGottenBalance");
console.log(testing1);//0 before page refresh

var testing2 = person.get("friendsInvitedBalance");
console.log(testing2);

var testing3 = person.get("answersGivenBalance");
console.log(testing3);

var karmaPointsBalance = testing3 + testing2 - testing1;

person.set("karmaPointsBalance", karmaPointsBalance);
person.save(null, {
 success: function(person) {
  console.log("saved the new karma points");
},
error: function(person, error) {
  console.log('Failed to create new object, with error code: ' + error.description);
}

});//person save
console.log(karmaPointsBalance);

          //display the karma points balance on the two scoreboard areas (screen and mobile)  

          $(".row.scoreboard .scoreboard .karma_points_display")
          .html("<span class='badge'>"+karmaPointsBalance+"</span>");

          $(".top-navbar-icon.karma-points .badge")
          .html("<span class='badge'>"+karmaPointsBalance+"</span>");

        });//then


}//get karmapoints balance

refreshKarmaPoints(user);   

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

$("#allKP_active_queries_list").on("click",".answers .btn", function(){
	var queryID = $(this).attr("id");
	answer = $(this).attr("name");
  var askerId = $(this).parents(".parent_row").children(".friend-name").attr("id");


  function setQueryAnswer() {
    console.log(answer);
    user.fetch();
    var answererName = user.get("username");
    console.log(answererName);
    myid = user.id;
    console.log(myid);
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
    console.log('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
    	'at' + queryAnswer.createdAt+'.');

  },
  error: function(queryAnswer, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
  }

});

//update the answers gotten points for the asker DOES NOT WORK

function updateAskerKarmaPoints () {

  KarmaQuery = Parse.Object.extend("KarmaQuery");
  //User = Parse.Object.extend("User");

  thisAskerQuery = new Parse.Query(KarmaQuery);
  thisAskerQuery.get(queryID, {
   success: function(item1) {
    console.log(item1);
    personAsking = item1.get("asker");
    console.log(personAsking);
    

    var userQuery = new Parse.Query(Parse.User);
    userQuery.get(personAsking.id, {
      success: function(item2) {
        console.log(item2);
        var testing4 = item2.get("answersGottenBalance");
console.log(testing4);//0 before page refresh
console.log("hi this is gil");



refreshKarmaPoints(personAsking);

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


updateAnswererKarmaPoints();
//updateAskerKarmaPoints(); //DOES NOT WORK

  }//answer questions

  setQueryAnswer();


});

  //delete button to hide queries

  $("#allKP_active_queries_list").on("click",".delete-button", function(){
  	$(this).parents(".parent_row").addClass("hidden");
  });





});//YUI

});//document.ready