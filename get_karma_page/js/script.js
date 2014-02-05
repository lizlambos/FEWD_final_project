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

    //var karmaPointsBalance = 0;
    //var friendsInvitedBalance = 0;
    //var answersGivenBalance = 0;
    //var answersGottenBalance = 0;

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

    function refreshKarmaPoints () {

      // query answers to get answers given

      var QueryAnswer = Parse.Object.extend("QueryAnswer");
      query = new Parse.Query(QueryAnswer);
      query.equalTo("answerer", user);

      query.find({
        success: function(results) {
          console.log(results.length);
          answersGivenBalance = results.length;
          console.log(answersGivenBalance);
          user.set("answersGivenBalance", answersGivenBalance);
          user.save();

          var toast8 = user.get("answersGivenBalance");
          console.log(toast8);


  //find total answers recieved by returning all query id's asked by user

  //reset answersGotten calculator placeholder to 0 
  answersGottenCalc = 0;

  var KarmaQuery = Parse.Object.extend("KarmaQuery");

  query1 = new Parse.Query(KarmaQuery);

  query1.equalTo("asker", user);

  query1.find({
    success: function(results1) {
      console.log(results1.length);

      Y.Array.each(results1, function(val, i, arr) {
        var answersGotten = val.get("responderCount");
        answersGottenCalc += answersGotten;
        user.set("answersGottenBalance", answersGottenCalc);
        user.save();
        console.log(answersGottenCalc);

          //get friends invited balance (function to be written)

          friendsInvitedBalance = 0;

          user.set("friendsInvitedBalance", friendsInvitedBalance);
          user.save();

          var toast = user.get("answersGottenBalance");
          console.log(toast);

        });

        },//success

        error: function(error) {
          alert("Error: " + error.code + " " + error.message);

        }

      });//find
},

error: function(error) {
  alert("Error: " + error.code + " " + error.message);
}

  })//answers given

var toast = user.get("answersGottenBalance");
console.log(toast);//0 before page refresh

var toast2 = user.get("friendsInvitedBalance");
console.log(toast2);

var toast3 = user.get("answersGivenBalance");
console.log(toast3);

var karmaPointsBalance = toast3 + toast2 - toast;

user.set("karmaPointsBalance", karmaPointsBalance);
user.save();
console.log(karmaPointsBalance);

          //display the karma points balance on the two scoreboard areas (screen and mobile)  

          $(".row.scoreboard .scoreboard .karma_points_display")
          .html("<span class='badge'>"+karmaPointsBalance+"</span>");

          $(".top-navbar-icon.karma-points .badge")
          .html("<span class='badge'>"+karmaPointsBalance+"</span>");


}//get karmapoints balance

refreshKarmaPoints();   



//refresh friends questions in the question area (no filters at this time)    

function loadFriendQueries(contentColumn){

	KarmaQuery = Parse.Object.extend("KarmaQuery");
	User = Parse.Object.extend("User");

	faQuery = new Parse.Query(KarmaQuery);
	faQuery.notEqualTo("privacylevel", "Private");
  faQuery.notEqualTo("asker", user);

  faQuery.include("User");
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
  	askerID = asker.id;
  	console.log(askerID);
  	askerName = val.get('askerName');
  	console.log(askerName);

//load picture of query asker

function getAskerPic() {
 query = new Parse.Query(User);
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

          FB.api(
            '/{'+askerFbID+'}/friends/{'+userFbID+'}',
            function (response) {
              if (response && !response.error) {
                console.log(response);
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
              else if (!response.error) {
                console.log(response);

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

        }//else if

        else {
          console.log("facebook graph api not saying if friends");
        }

      }//function response
      );//fb api

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

  refreshKarmaPoints();   




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
    alert('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
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

  var userQuery = new Parse.Query(Parse.User);
  userQuery.get(askerId, {
    success: function(item) {

      item.set("answersGottenBalance", 
        item.get("answersGottenBalance")+1);
      item.save();

          //???
          item.set("karmaPointsBalance",
            item.get("karmaPointsBalance")-1);
          item.save();

        },
        error: function(item, error) {
            //alert("Error when checking for friend ID: " + error.code + " " + error.message);
          }
      });//find

}//update asker karma points


updateAnswererKarmaPoints();
updateAskerKarmaPoints(); //DOES NOT WORK

  }//answer questions

  setQueryAnswer();


});

  //delete button to hide queries

  $("#allKP_active_queries_list").on("click",".delete-button", function(){
  	$(this).parents(".parent_row").addClass("hidden");
  });





});//YUI

});//document.ready