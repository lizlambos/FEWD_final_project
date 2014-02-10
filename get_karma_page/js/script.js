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

    user = Parse.User.current();
    console.log(user);
    var toad = user.get('fbID');
    console.log(toad);

    KarmaQuery = Parse.Object.extend("KarmaQuery");
    QueryAnswer = Parse.Object.extend("QueryAnswer");

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

      $(".top-navbar-icon.karma-points .badge")
      .html("<span class='badge'>"+karmaPointsBalance+"</span>");

    });//current user fetch
    } //calc KarmaPointsBalance


      // query answers to get answers given

      function refreshAnswersGiven () {

       console.log("gotten balance function done");

       Parse.User.current().fetch().then(function (user) {

        QueryAnswer = Parse.Object.extend("QueryAnswer");
        query = new Parse.Query(QueryAnswer);
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

//refresh friends questions in the question area (no filters at this time)    

function loadFriendQueries(){

	KarmaQuery = Parse.Object.extend("KarmaQuery");
	//User = Parse.Object.extend("User");

	faQuery = new Parse.Query(KarmaQuery);
	faQuery.notEqualTo("privacylevel", "Private");
  faQuery.notEqualTo("asker", user);

  faQuery.ascending("createdAt");

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

//function loads user picture and question and screens by privacy level and whether asker has enough karma points

function screenAndLoad() {

   //update the answers gotten points for the asker DOES NOT WORK

   var userQuery = new Parse.Query(Parse.User);
   userQuery.get(askerID, {
    success: function(item2) {
      askerPic = item2.get('userPic');

      //get the karma points balance of hte asker (note this is not saved for the asker until they log on but can be calc'ed when they are offline)

      function updateAskerKarmaPoints () {
        console.log(askerID);


          //update the answers the user has given 

          function refreshAnswersGiven2 ()  {

            console.log(item2.id);

            var QueryAnswer = Parse.Object.extend("QueryAnswer");
            query = new Parse.Query(QueryAnswer);
            query.equalTo("answerer", item2);

            query.find({
              success: function(results) {
                console.log(results.length);
                var answersGivenBalance = results.length;
                console.log(answersGivenBalance);

            //update the responder counts for their questions

            function refreshAnswersGotten2 () { 
              numQuery = new Parse.Query(QueryAnswer);
              numQuery.equalTo("asker",item2);
              numQuery.find({
                success: function(numResults) {
                  var totalRespCount = numResults.length;
                  console.log(numResults.length);

                  function refreshFriendsInvited2()  { 
                    var friendsInvitedBalance = 0;
                    console.log(friendsInvitedBalance);

                    function calcKarmaPointsBalance2 (){

                      var karmaPointsBalance = answersGivenBalance + 
                      friendsInvitedBalance - totalRespCount;
                      console.log(karmaPointsBalance);

                      if (karmaPointsBalance <= 0) {
                        $("#"+questId+"").
                        parents(".parent_row").addClass("hidden");}

                      }; //calc KarmaPointsBalance

                      calcKarmaPointsBalance2();
                    }//friendsinvited

                    refreshFriendsInvited2();
                  },
                  error: function(numResults, error) {
                    alert("Error when updating todo item: " + error.code + " " + error.message);
                  }

              });//find function

}//getquery answers

refreshAnswersGotten2();

},
error: function(error) {
  alert("Error: " + error.code + " " + error.message);
}

 });//find

}//get queryAnswers

refreshAnswersGiven2();

}//update asker karma points

updateAskerKarmaPoints();

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

           if ((i+1)%3 ===0) {
             allKPQueryColumn1.prepend(content);
           }
           else if ((i+1)%2 ===0) {
            allKPQueryColumn2.prepend(content);
          }
          else{
            allKPQueryColumn3.prepend(content);
          }

        }

        else {

          var user = Parse.User.current();

          user.fetch().then(function (user) {
            user.get('id');


            var askerFbID = item2.get('fbID');
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

              if ((i+1)%3 ===0) {
               allKPQueryColumn1.prepend(content);
             }
             else if ((i+1)%2 ===0) {
              allKPQueryColumn2.prepend(content);
            }
            else{
              allKPQueryColumn3.prepend(content);
            }


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

          if ((i+1)%3 ===0) {
           allKPQueryColumn1.prepend(content);
         }
         else if ((i+1)%2 ===0) {
          allKPQueryColumn2.prepend(content);
        }
        else{
          allKPQueryColumn3.prepend(content);
        }


      }

      });//fetch then

        }//else

          },//item 2 success

          error: function(item2, error) {
            console.log(askerId);
            console.log("cant find ya");
            //alert("Error when checking for friend ID: " + error.code + " " + error.message);
          }
  });//get 2

      }//get asker pic about

      screenAndLoad();
      
    });//y.array

  }//success

  });//find

}//load friend queries

//calling function on three columns but content is being repeated need to put in more arugments for each query  

loadFriendQueries();


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

      queryAnswer.save( {asker: questAsker}, {
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



    refreshKarmaPoints();


  });

});//onclick


  //delete button to hide queries

  $("#allKP_active_queries_list").on("click",".delete-button", function(){
  	$(this).parents(".parent_row").addClass("hidden");
  });





});//YUI

});//document.ready