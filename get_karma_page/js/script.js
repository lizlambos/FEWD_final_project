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
    var QueryAnswer = Parse.Object.extend("QueryAnswer");

   //quick intro for first time users 

   user.fetch().then(function(){
    var hadIntro = user.get("hadTour");
    if (hadIntro == true) {

    }
    else {
     $(".helper_popup, .outer").removeClass("hidden");
     $(".go_button").click(function(){
      $("#guided_tour1").fadeOut('slow');
      $(".outer").addClass("hidden");
      user.set("hadTour", true);
      user.save({
        success: function(user) {
          console.log("saved user tour status")
        },
        error: function(error) {
          console.log("didn't save user tour status");
        }
      })

    });

   }

    });//fetch

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
      askerFbID = item2.get("fbID");

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

                      //screen to not show question if asker doesnt have karma points

                      if (karmaPointsBalance <= -10) {
                        $("#"+questId+"").
                        parents(".parent_row").addClass("hidden");}

                        else {
                         //screen if someone has answered it before

                         function screenIfAnswered () {
                          console.log("screen answered function running");
                          var user = Parse.User.current();
                          var QueryAnswer = Parse.Object.extend("QueryAnswer");
                          var answeredYetQuery = new Parse.Query(QueryAnswer);
                          answeredYetQuery.equalTo("queryID", questId);
                          answeredYetQuery.equalTo("answerer", user);
                          answeredYetQuery.find({
                            success:function(results3){
                             console.log(results3.length);
                             if (results3.length > 0) {
                              console.log("user already answered this question "+questId+"");
                              $("#"+questId+"").
                              parents(".parent_row").addClass("hidden"); }
                              else {
                                console.log("new question for user "+questId+"");
                              }


                            },
                            error: function(error) {
                              console.log("somehting wrong with the answer query");
                            }
                          });
                        }

                        screenIfAnswered();

                      } 


                      }; //calc KarmaPointsBalance

                      calcKarmaPointsBalance2();
                    }//friendsinvited

                    refreshFriendsInvited2();
                  },
                  error: function(numResults, error) {
                    alert("Error when updating scrren when answered section: " + error.code + " " + error.message);
                  }

              });//find function

}//getquery answers

refreshAnswersGotten2();

},
error: function(error) {
  alert("Error Answers Gotten Section line 350: " + error.code + " " + error.message);
}

 });//find

}//get queryAnswers

refreshAnswersGiven2();

}//update asker karma points

updateAskerKarmaPoints();


//check if question marked as anonymous

var showName = val.get("anonymity");
console.log(val.id);
console.log(showName);
var user = Parse.User.current();
if (showName === "Yes") {

  //user.fetch().then(function (user) {
    user.get('id');

    console.log(askerFbID);
    var userFbID = user.get('fbID');
    console.log(userFbID);

    var userFriendsArray = user.get('fbFriends');
    //console.log(userFriendsArray);

    function findFriendMatch(friendFbId){
      return $.grep(userFriendsArray, function(n, i){
        return n.id == friendFbId;
      });
    };

    findFriendMatch(askerFbID);  

    if (findFriendMatch(askerFbID) != "") {
      console.log("friends");

      askerName = "friend";
      profilePic = "../../img/friends.png"

    }

    else {
      askerName = "anonymous";
      profilePic = "../../img/SquareLogo_FB_size.png"
    }

  //});//fetch



}

else {
  askerName = val.get("askerName");
  profilePic = askerPic;
}

//create color array and put in background pic if there was one

var queryDesignArray = ["#FF3B30","#FFDB4C","#007AFF","#5856D6","#52EDC7"];

var p = Math.floor((Math.random()*queryDesignArray.length));

var queryPic = val.get("queryPicUrl");


if (! queryPic) {
  userImageUpload = "";

  var componentDesign = "background-color:"+queryDesignArray[p]+";color:#FFFFFF;";
  var questionComponentDesign = "color:#FFFFFF;background-image:url('"+userImageUpload+"');background-size:320px 320px";
  var questionTextStyle = "color:#FFFFFF;";
  var buttonDesign="color:"+queryDesignArray[p]+";";



}

else {
  userImageUpload = val.get("queryPicUrl");
  console.log(userImageUpload);

    //userImageUpload = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1/c0.16.362.362/s148x148/992829_10100835125558487_423853919_n.jpghttps://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1/c0.16.362.362/s148x148/992829_10100835125558487_423853919_n.jpg"

    if ($(window).width() > 768 ) {

      var componentDesign = "background-color:"+queryDesignArray[p]+";color:#FFFFFF;";
      var questionComponentDesign = "color:#FFFFFF;background-image:url('"+userImageUpload+"');background-size:320px 320px; height:320px;";
      var questionTextStyle = "color:#FFFFFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;height:250px;padding: 80px 10px 0px 10px;";
      var buttonDesign="color:"+queryDesignArray[p]+";";

    }

    else {
      var componentDesign = "background-color:"+queryDesignArray[p]+";color:#FFFFFF;";
      var questionComponentDesign = "color:#FFFFFF;background-image:url('"+userImageUpload+"');background-size:320px 320px";
      var questionTextStyle = "color:#FFFFFF;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;";
      var buttonDesign="color:"+queryDesignArray[p]+";";

    }
  }


/*@questionRed:#FF3B30;
@questionOrange:#FF9500;
@questionYellow:#FFCC00;
@questionGreen:#4CD964;
@questionBlue:#007AFF;
@questionPurple:#5856D6;

background-color:{colorPick};color:{textColorPick*/

         //screen by privacy level 

         var privacySetting = val.get('privacylevel');

         var timeDisplay = val.createdAt;
         console.log(timeDisplay);
         var timeNow = new Date();
         console.log(timeNow);

         var timeDiffMinutes = ((((timeNow - timeDisplay)/1000)/60));
         console.log(Math.floor(timeDiffMinutes));

         var timeDiffHours = timeDiffMinutes/60;
         var timeDiffDays = timeDiffHours/24;

         if (timeDiffDays > 1) {

          if (timeDiffDays <2) {
            var timeStamp = Math.floor(timeDiffDays) + " day ago";
          }
          else {
            var timeStamp = Math.floor(timeDiffDays) + " days ago";
          }
          
         }

         else if (timeDiffHours <=24 && timeDiffHours > 1) {
          if(timeDiffHours <2) {
            var timeStamp = Math.floor(timeDiffHours)+ " hour ago";
          }
          else {
          var timeStamp = Math.floor(timeDiffHours)+ " hours ago";
        }
         }

         else {
        
            var timeStamp = Math.floor(timeDiffMinutes) + "min ago";
        
         }

         if (privacySetting == "All KP") {

           var content = Y.Lang.sub(Y.one('#friends_queries_section').getHTML(), {
            queryText: val.get('text'),
            timeStamp: timeStamp,
            askerName: askerName,
            id: val.id,
            privacylevel: "",
            askerID: askerID,
            askerPicURL: profilePic,
            componentDesign: componentDesign,
            questionTextStyle: questionTextStyle,
            questionComponentDesign: questionComponentDesign,
            buttonDesign: buttonDesign


          });


           if ((i)%3 === 0) {
             allKPQueryColumn1.prepend(content);
           }
           else if ((i)%2 === 0) {
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
                timeStamp: timeStamp,
                askerName: askerName,
                id: val.id,
                privacylevel: "",
                askerID: askerID,
                askerPicURL: profilePic,
                questionTextStyle: questionTextStyle,
                componentDesign: componentDesign,
                buttonDesign: buttonDesign

              });

              if ((i)%3 === 0) {
               allKPQueryColumn1.prepend(content);
             }
             else if ((i)%2 === 0) {
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
            askerPicURL: askerPic,
            questionTextStyle: questionTextStyle,
            componentDesign: componentDesign,
            buttonDesign: buttonDesign


          });

          //filter by privacy level

          if ((i)%3 ===0) {
           allKPQueryColumn1.prepend(content);
         }
         else if ((i)%2 ===0) {
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


//DOES NOT WORK set question text vertically centered



$("body").on("click", ".question p", function(){
  var questHeight = $(this).parents(".question").css("height");
  var textHeight = $(this).css("height");
  var setTop = (questHeight - textHeight) * 0.5;
  $(this).css("top:"+setTop+"px");

});



//on Click to create answer, update answere KP, reveal answer and make div disappear

$("#allKP_active_queries_list").on("click",".answers .btn", function(){

	var queryID = $(this).attr("id");
  var answer = $(this).attr("name");
  var yesButton = $(this).parents(".answers").children(".yes-button");
  var noButton = $(this).parents(".answers").children(".no-button");
  var parentRow = $(this).parents(".parent_row");
  var askerId = $(this).parents(".content_component_container").find(".friend-name").attr("id");
  console.log(askerId);

            var def1 = $.Deferred();
            def1.done(revealAnswers);
            var def2 = $.Deferred();
            def2.done(refresher);
            var def3 = $.Deferred();
            def3.done(divDisappear);

            function divDisappear () {
              console.log("disappear function being fired");

              setTimeout(function(){ 

               $("#answer_reveal").parents(".outer").addClass("hidden");
             }, 4500 );

              setTimeout(function(){ 

               parentRow.fadeOut("slow");
             }, 5000 );

            }

            function refresher () {
             refreshKarmaPoints();
             def3.resolve();
           }
    //reveal answers

    function revealAnswers(){

    	var KarmaQuery = Parse.Object.extend("KarmaQuery");
    	getAnswersQuery = new Parse.Query(KarmaQuery);

    	getAnswersQuery.get(queryID, {
    		success: function(item) {
          item.fetch().then(function(){

            var QueryAnswer = Parse.Object.extend("QueryAnswer");
            getLatestYesResults = new Parse.Query("QueryAnswer");
            getLatestYesResults.equalTo("queryID", queryID);
            getLatestYesResults.equalTo("answer", 'yes');

            getLatestYesResults.find({
              success: function(results4) {
                var yesAnswers = results4.length;
                item.set("yesResponderCount", yesAnswers);

                var QueryAnswer = Parse.Object.extend("QueryAnswer");
                getLatestNoResults = new Parse.Query("QueryAnswer");
                getLatestNoResults.equalTo("queryID", queryID);
                getLatestNoResults.equalTo("answer", 'no');

                getLatestNoResults.find({
                  success: function(results5) {
                    var noAnswers = results5.length;
                    item.set("noResponderCount", noAnswers);

                    var totalAnswers = noAnswers + yesAnswers;
                    console.log(totalAnswers);


                    if (totalAnswers != 0) {

                      var percentYesAnswers = Math.round(
                       (yesAnswers / totalAnswers)*100);

                      var percentNoAnswers = Math.round(
                       (noAnswers / totalAnswers)*100);

                      console.log(percentYesAnswers);
                      console.log(percentNoAnswers);
                    }

                    else {
                      var percentYesAnswers = 0;
                      var percentNoAnswers = 0;

                      console.log(percentNoAnswers);
                      console.log(percentYesAnswers);

                    }


                    var yesDegreeTurn = (percentYesAnswers/100)*360;
                    var noDegreeTurn = (percentNoAnswers/100)*360;

                    console.log(yesDegreeTurn);
                    console.log(noDegreeTurn);


                    if (percentYesAnswers >= percentNoAnswers) {

                      $('.answer_bubble').html(percentYesAnswers+"%");
                      $('.majority_answer').html("YES!");
                      $('#answer_reveal').parents(".outer").removeClass("hidden");
                      $(".results_background").css("background-color","#4CD964");
                      $('#yes_portion .pie').css({"background-color":"#FF9500","-webkit-transform":"rotate("+noDegreeTurn+"deg)","-moz-transform":"rotate("+noDegreeTurn+"deg)","-o-transform":"rotate("+noDegreeTurn+"deg)","transform":"rotate("+noDegreeTurn+"deg)"});

                      yesButton.html(percentYesAnswers+"%")
                      .css({"font-size": "2.25em","font-weight":"bold", "color": "#FFFFFF", "width":"100px", "height":"100px", "animation":"myfirst 5s;", "-webkit-animation":"myfirst 5s;"});


                      noButton.html(percentNoAnswers+"<span class='percent'>%</span>")
                      .css({"font-size": "2.25em", "font-weight":"bold", "color": "#FFFFFF", "width":"100px", "height":"100px"});   

                    }

                    else if (percentNoAnswers > percentYesAnswers) {

                      $('.answer_bubble').html(percentNoAnswers+"%");
                      $('.majority_answer').html("No!");
                      $('#answer_reveal').parents(".outer").removeClass("hidden");
                      $(".results_background").css("background-color","#FF9500");
                      $('#yes_portion .pie').css({"background-color":"#4CD964","-webkit-transform":"rotate("+yesDegreeTurn+"deg)","-moz-transform":"rotate("+yesDegreeTurn+"deg)","-o-transform":"rotate("+yesDegreeTurn+"deg)","transform":"rotate("+yesDegreeTurn+"deg)"});


                      yesButton.html(percentYesAnswers+"%")
                      .css({"font-size": "2.25em","font-weight":"bold", "color": "#FFFFFF", "width":"100px", "height":"100px"});


                      noButton.html(percentNoAnswers+"<span class='percent'>%</span>")
                      .css({"font-size": "2.25em","font-weight":"bold", "color": "#FFFFFF", "width":"100px", "height":"100px", "animation":"myfirst 5s;", "-webkit-animation":"myfirst 5s;"});

                    }
                    item.save({
                      success: function(){
                        console.log("saved latest yes responders");
                      },
                      error: function(){
                        console.log("didn't save latest yes responders");
                      }
                    }).then(function(){
                      def2.resolve();
                    });
                  },
                  error: function(error) {
                    console.log("couldn't find good answers")
                  }

              });//no find
},
error: function(error) {
  console.log("couldn't find good answers")
}

      });//yes find

        });//fetch

},
error: function(error) {
 alert("Error when updating revealing answers line 565");
}

});//get function

}//

function createAnswer () {

  console.log(answer);
  //var askerId = $(this).parents(".content_component_container").children(".friend-name").attr("id");
  console.log(askerId);



  console.log(answer);
  user.fetch();
  var answererName = user.get("username");
  console.log(answererName);
  myid = user.id;
  console.log(myid);
  var userFbID = user.get('fbID');
  var d = new Date();
  var dString = d.toString();
  timeStamp = dString.substring(4,21);
  console.log(queryID);

  getAskerFbIdQuery = new Parse.Query(Parse.User);

     getAskerFbIdQuery.get(askerId, {
      success: function(item4) {

          var askerFbID = item4.get('fbID');
          console.log(askerFbID);
         
          console.log(userFbID);

          var userFriendsArray = user.get('fbFriends');

          function findFriendMatch(friendFbId){
            return $.grep(userFriendsArray, function(n, i){
              return n.id == friendFbId;
            });
          };

          findFriendMatch(askerFbID);  

          if (findFriendMatch(askerFbID) != "") {
            console.log("friends");
            isAnswererFriend = "friend";
       }

       else  {
        console.log("not friends");
        isAnswererFriend = "not friend";
       }

// get the gender of the answerer from facbeook (eventually can be deleted and changed as will be stored for each user)
 user = Parse.User.current();
 FB.api('/me', function(response) {
          if (!response.error) {

            var answererGender = response.gender;
            console.log(answererGender);
          }

          else {
            var answererGender = "no gender";
            console.log(answererGender);
          }


  var QueryAnswer = Parse.Object.extend("QueryAnswer");
  queryAnswer = new QueryAnswer();

  queryAnswer.set("answerer", user);
  queryAnswer.set("answererName", answererName);
  queryAnswer.set("answer", answer);
  queryAnswer.set("queryID", queryID);
  queryAnswer.set("timeStamp", timeStamp);
  queryAnswer.set("isAnswererFriend",isAnswererFriend);
  queryAnswer.set("answererGender",answererGender);


  queryAnswer.save(null, {
   success: function(queryAnswer) {
    console.log(answer);

    console.log('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
      'at' + queryAnswer.createdAt+'.');

  },
  error: function(queryAnswer, error) {

    alert('Failed to create new object 626 WOMP WOMP, with error code: ' + error.description);
  }

});//save

    });     // FB api call


},
error: function(error) {
  console.log("problem with new function querying for friends status 910")
}

//ends get function

  }).then(function(){

  // save the asker of the question as an attribute of the answer for easy querying later

  var KarmaQuery = Parse.Object.extend("KarmaQuery");
  queryAsker = new Parse.Query(KarmaQuery);
  queryAsker.get(queryID, {
    success:function(item) {
      item.fetch().then(function(){
        var questAsker = item.get("asker");
        console.log(questAsker.id);

        queryAnswer.save( {asker: questAsker}, {
         success: function(queryAnswer) {

          console.log('New object created with objectId: ' + queryAnswer.id + 'by' + queryAnswer.answerer +
            'at' + queryAnswer.createdAt+'.');

        },
        error: function(error) {

          alert('Failed to create new object 650 because of asker, with error code: ' + error.description);
        }

      }).then(function(){

        def1.resolve();

    });//then function

  });//fetch

    },
    error:function(item, error) {
      console.log("problem finding asker 661");
    }

  });//get

});//then function

}//create answer

createAnswer();

}); // end of onclick function


//delete button to hide queries

$("#allKP_active_queries_list").on("click",".delete-button", function(){
 $(this).parents(".parent_row").addClass("hidden");
});





});//YUI

});//document.ready