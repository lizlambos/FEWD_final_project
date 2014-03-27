$(document).ready(function(){


  YUI().use('node', function (Y) {





    Parse.$ = jQuery;

    Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL"); 

    var user = Parse.User.current();
    console.log(user);

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

function getUrlVars()
{
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

var queryID = getUrlVars()["url"];
console.log(queryID);


KarmaQuery = Parse.Object.extend("KarmaQuery");

var query = new Parse.Query(KarmaQuery)

query.get(queryID, {
  success: function(item) {
    var queryPicURL = item.get("queryPicUrl");
    console.log(queryPicURL);
    var yesResponderCount = item.get("yesResponderCount");
    var noResponderCount = item.get("noResponderCount");
    var totalRespCount = yesResponderCount + noResponderCount;
    console.log(totalRespCount);
    var privacyLevel = item.get("privacylevel");
    console.log(privacyLevel);
    var anonymity = item.get("anonymity");
    var questionText = item.get("text");

         // reformatting the time stamp to be time from today       

         var timeDisplay = item.createdAt;
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

        console.log(timeStamp);

//setting page contents based on query results

$("img.query_pic").attr("src", queryPicURL);
$(".question_text_box #questText").text(questionText);
$(".label.label-default").html("<span class='glyphicon glyphicon-time'></span>"+timeStamp+"");
$(".responder_count").html(totalRespCount);

if (privacyLevel == "All KP") {
  $(".btn-group.privacy-level .kp_button").addClass("active");
  $(".btn-group.privacy-level .fb_button").removeClass("active");
  $(".btn-group.privacy-level .private_button").removeClass("active");
}

else if (privacyLevel == "FB Friends") {
  $(".btn-group.privacy-level .kp_button").removeClass("active");
  $(".btn-group.privacy-level .fb_button").addClass("active");
  $(".btn-group.privacy-level .private_button").removeClass("active");
}

else {
 $(".btn-group.privacy-level .kp_button").removeClass("active");
 $(".btn-group.privacy-level .fb_button").removeClass("active");
 $(".btn-group.privacy-level .private_button").addClass("active");
}

if (anonymity == "Yes") {
  $("#anonymity_option #anonymous").addClass("active");
  $("#anonymity_option #not_anonymous").removeClass("active");
}

else {
  $("#anonymity_option #anonymous").removeClass("active");
  $("#anonymity_option #not_anonymous").addClass("active");

}




QueryAnswer = Parse.Object.extend("QueryAnswer");

var queryAns = new Parse.Query(QueryAnswer);
queryAns.equalTo("queryID", queryID);


queryAns.find({
  success: function(results) {
    console.log(results.length);

    var yesResponderCount = 0;
    var noResponderCount = 0;

    var allMaleYesResponderCount = 0;
    var allMaleNoResponderCount = 0;

    var allFemaleYesResponderCount = 0;
    var allFemaleNoResponderCount = 0;

    var friendMaleYesResponderCount = 0;
    var friendMaleNoResponderCount = 0;

    var friendFemaleYesResponderCount = 0;
    var friendFemaleNoResponderCount = 0;


    for (i=0; i<results.length; i++) {
      console.log(results[i].get("answer"));
      if (results[i].get("answer") == "yes"){
        yesResponderCount += 1;


        if (results[i].get("answererGender") == "female") {
          allFemaleYesResponderCount += 1;
        }
        else  if (results[i].get("answererGender") == "female" && results[i].get("isAnswererFriend") == "friend") {
          friendFemaleYesResponderCount += 1;
        }
        else if (results[i].get("answererGender") == "male") {
          allMaleYesResponderCount += 1;
        }
        else  if (results[i].get("answererGender") == "male" && results[i].get("isAnswererFriend") == "friend") {
          friendMaleYesResponderCount += 1;
        }


      }

      else if (results[i].get("answer") == "no"){

        noResponderCount += 1;

        if (results[i].get("answererGender") == "female") {
          allFemaleNoResponderCount += 1;
        }
        else  if (results[i].get("answererGender") == "female" && results[i].get("isAnswererFriend") == "friend") {
          friendFemaleNoResponderCount += 1;
        }
        else if (results[i].get("answererGender") == "male") {
          allMaleNoResponderCount += 1;
        }
        else  if (results[i].get("answererGender") == "male" && results[i].get("isAnswererFriend") == "friend") {
          friendMaleNoResponderCount += 1;
        }

      }

          }//for loop

          var responderCount = yesResponderCount + noResponderCount;
          var allMaleResponderCount = allMaleYesResponderCount + allMaleNoResponderCount;
          var allFemaleResponderCount = allFemaleYesResponderCount + allFemaleNoResponderCount; 
          var friendMaleResponderCount = friendMaleYesResponderCount + friendMaleNoResponderCount;
          var friendFemaleResponderCount = friendFemaleYesResponderCount + friendFemaleNoResponderCount; 
          var friendResponderCount = friendMaleResponderCount + friendFemaleResponderCount;

          console.log(noResponderCount);
          console.log(yesResponderCount);
          console.log(yesResponderCount+noResponderCount);
          console.log(responderCount);
          console.log(allFemaleYesResponderCount);
          console.log(friendMaleYesResponderCount);
          console.log(allMaleYesResponderCount);
          console.log(friendMaleNoResponderCount);
          console.log(allMaleNoResponderCount);


          if ($(window).width() < "768") {
            if (responderCount != 0) {

              var percentYesAnswers = Math.round(
                (yesResponderCount / responderCount)*100);

              var percentNoAnswers = Math.round(
                (noResponderCount / responderCount)*100);

              console.log(percentYesAnswers);
              console.log(percentNoAnswers);

              if (percentYesAnswers == 100) {
                console.log($(window).width());
                var formatYesAnswers = Math.max ( 40, (percentYesAnswers/100)*($(window).width() * .75 ));
                var formatNoAnswers = 0;
                var noAnswerHide = "hidden";
                var yesAnswerHide = "";
                console.log(formatNoAnswers);

              }

              else if (percentNoAnswers == 100) {
                console.log($(window).width());
                var formatNoAnswers = Math.max ( 40, (percentNoAnswers/100)*($(window).width() * .75 ));
                var formatYesAnswers = 0;
                var yesAnswerHide = "hidden";
                var noAnswerHide = "";
                console.log(formatNoAnswers);
                console.log(yesAnswerHide);

              }

              else {
                var formatYesAnswers = (percentYesAnswers/100)*(($(".main_content_container").width()-56) * .90 );
                var formatNoAnswers =  (percentNoAnswers/100)*(($(".main_content_container").width()-56) * .90);
                console.log(formatNoAnswers);
                var yesAnswerHide = "";
                var noAnswerHide = "";

              }

            }

            else {
              var percentYesAnswers = 0;
              var percentNoAnswers = 0;
              var formatYesAnswers = 60;
              var formatNoAnswers = 60;
              var yesAnswerHide = "";
              var noAnswerHide = "";
            }

          }

          else {

            if (responderCount != 0) {

              var percentYesAnswers = Math.round(
                (yesResponderCount / responderCount)*100);

              var percentNoAnswers = Math.round(
                (noResponderCount / responderCount)*100);

              console.log(percentYesAnswers);
              console.log(percentNoAnswers);

              if (percentYesAnswers == 100) {
                console.log($(window).width());
                var formatYesAnswers = Math.max ( 90, (percentYesAnswers/100)*($(".main_content_container").width() * .76 ));
                var formatNoAnswers = 0;
                var noAnswerHide = "hidden";
                var yesAnswerHide = "";
                console.log(formatNoAnswers);
                console.log(yesAnswerHide);


              }

              else if (percentNoAnswers == 100) {
                console.log($(window).width());
                var formatNoAnswers = Math.max ( 90, (percentNoAnswers/100)*($(".main_content_container").width() * .76 ));
                var formatYesAnswers = 0;
                var yesAnswerHide = "hidden";
                var noAnswerHide = "";
                console.log(formatNoAnswers);
                console.log(yesAnswerHide);

              }
              else {
                var formatYesAnswers = (percentYesAnswers/100)*(($(".main_content_container").width()-85) * .95 );
                var formatNoAnswers =  (percentNoAnswers/100)*(($(".main_content_container").width()-85) * .95 );
                console.log(formatNoAnswers);
                var yesAnswerHide = "";
                var noAnswerHide = "";

              }
            }

            else {
              var percentYesAnswers = 0;
              var percentNoAnswers = 0;
              var formatYesAnswers = 120;
              var formatNoAnswers = 120;
              var yesAnswerHide = "";
              var noAnswerHide = "";
            }



                    }//else

                    $("#totalYes").css("width",formatYesAnswers).addClass(""+yesAnswerHide+"");
                    $("#totalYes .result").html(percentYesAnswers+"%");
                    $("#totalNo").css("width",formatNoAnswers).addClass(""+noAnswerHide+"");
                    $("#totalNo .result").html(percentNoAnswers+"%");


                    if (allMaleResponderCount != 0) {

                     var allMalePercentYesAnswers = Math.round(
                      (allMaleYesResponderCount / allMaleResponderCount)*100);

                     var allMalePercentNoAnswers = Math.round(
                      (allMaleNoResponderCount / allMaleResponderCount)*100);

                   }

                   else {

                    var allMalePercentYesAnswers = 0;

                    var allMalePercentNoAnswers = 0;

                  }

                  if (allFemaleResponderCount != 0) {

                   var allFemalePercentYesAnswers = Math.round(
                    (allFemaleYesResponderCount / allFemaleResponderCount)*100);

                   var allFemalePercentNoAnswers = Math.round(
                    (allFemaleNoResponderCount / allFemaleResponderCount)*100);

                 }

                 else {

                  var allFemalePercentYesAnswers = 0;

                  var allFemalePercentNoAnswers = 0;

                }

                if (friendMaleResponderCount != 0) {

                  var friendMalePercentYesAnswers = Math.round(
                    (friendMaleYesResponderCount / friendMaleResponderCount)*100);

                  var friendMalePercentNoAnswers = Math.round(
                    (friendMaleNoResponderCount / friendMaleResponderCount)*100);

                }

                else {

                  var friendMalePercentYesAnswers = 0;

                  var friendMalePercentNoAnswers = 0;

                }

                if (friendFemaleResponderCount != 0) {


                  var friendFemalePercentYesAnswers = Math.round(
                    (friendFemaleYesResponderCount / friendFemaleResponderCount)*100);

                  var friendFemalePercentNoAnswers = Math.round(
                    (friendFemaleNoResponderCount / friendFemaleResponderCount)*100);  

                }

                else {

                  var friendFemalePercentYesAnswers = 0;

                  var friendFemalePercentNoAnswers = 0;

                }

                var allMaleYesDegreeTurn = (allMalePercentYesAnswers/100)*360;
                var allMaleNoDegreeTurn = (allMalePercentNoAnswers/100)*360;



                var allFemaleYesDegreeTurn = (allFemalePercentYesAnswers/100)*360;
                var allFemaleNoDegreeTurn = (allFemalePercentNoAnswers/100)*360;



                var friendMaleYesDegreeTurn = (friendMalePercentYesAnswers/100)*360;
                var friendMaleNoDegreeTurn = (friendMalePercentNoAnswers/100)*360;


                var friendFemaleYesDegreeTurn = (friendFemalePercentYesAnswers/100)*360;
                var friendFemaleNoDegreeTurn = (friendFemalePercentNoAnswers/100)*360;

                console.log(allMaleYesDegreeTurn);
                console.log(allMaleNoDegreeTurn);


                function pieChartPopulate(percentY, percentN, degTurnY, degTurnN, demographic) {

                  if (percentY > percentN) {

                    $('#'+demographic+' .answer_bubble').html(percentY+"%");
                    $('#'+demographic+' .majority_answer').text("YES!");
                    
                    $('#'+demographic+' .results_background').css("background-color","#4CD964");
                    $('#'+demographic+' #yes_portion .pie').css({"background-color":"#FF9500","-webkit-transform":"rotate("+degTurnN+"deg)","-moz-transform":"rotate("+degTurnN+"deg)","-o-transform":"rotate("+degTurnN+"deg)","transform":"rotate("+degTurnN+"deg)"});
                  }

                  else if (percentN > percentY) {

                    $('#'+demographic+' .answer_bubble').html(percentN+"%");
                    $('#'+demographic+' .majority_answer').text("No!");
             
                    $('#'+demographic+' .results_background').css("background-color","#FF9500");
                    $('#'+demographic+' #yes_portion .pie').css({"background-color":"#4CD964","-webkit-transform":"rotate("+degTurnY+"deg)","-moz-transform":"rotate("+degTurnY+"deg)","-o-transform":"rotate("+degTurnY+"deg)","transform":"rotate("+degTurnY+"deg)"});

                  }
                  else {
                    $('#'+demographic+' .answer_bubble').html(percentY+"%");
            
                   $('#'+demographic+' .answerText').html("it's a <span class='majority_answer'>TIE!</span>").css("text-align","center");
                    $('#'+demographic+' .results_background').css("background-color","#4CD964");
                    $('#'+demographic+' #yes_portion .pie').css({"background-color":"#FF9500","-webkit-transform":"rotate("+degTurnN+"deg)","-moz-transform":"rotate("+degTurnN+"deg)","-o-transform":"rotate("+degTurnN+"deg)","transform":"rotate("+degTurnN+"deg)"});


                  }

                    $(".row .col-xs-6.answer_reveal .results_container").css("text-align","center");

                         }//function

                         pieChartPopulate(allMalePercentYesAnswers, allMalePercentNoAnswers, allMaleYesDegreeTurn, allMaleNoDegreeTurn, "guy_user_answers");
                         pieChartPopulate(allFemalePercentYesAnswers, allFemalePercentNoAnswers, allFemaleYesDegreeTurn, allFemaleNoDegreeTurn, "girl_user_answers");
                         pieChartPopulate(friendMalePercentYesAnswers, friendMalePercentNoAnswers, friendMaleYesDegreeTurn, friendMaleNoDegreeTurn, "guy_friends_answers");
                         pieChartPopulate(friendFemalePercentYesAnswers, friendFemalePercentNoAnswers, friendFemaleYesDegreeTurn, friendFemaleNoDegreeTurn, "girl_friends_answers");



                       },
                       error: function(error) {


                       }


                     });




},
error: function(error) {
  console.log("could not find query")
}
     });//get

//allow the user to change the privacy level of the question via the button

$(".content_component_container").on("click","#privacy_option .btn", function () {

  $(this).siblings(".btn").removeClass("active");
  $(this).addClass("active");
  newPrivacyLevel = $(this).text();
  console.log(newPrivacyLevel);
  
  query = new Parse.Query(KarmaQuery);
  query.get(queryID, {
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
      console.log("Error when updating todo item: " + error.code + " " + error.message);
    }

  });//get function 

}); //on function

//allow the user to change the anonymity option of the question via the button

$(".content_component_container").on("click","#anonymity_option .btn", function () {

  $(this).siblings(".btn").removeClass("active");
  $(this).addClass("active");
  anonymity = $(this).text();
  console.log(anonymity);
  

  query = new Parse.Query(KarmaQuery);
  query.get(queryID, {
    success: function(item) {
      item.set('anonymity', anonymityl);
      item.save();
      console.log(anonymity);
      test1 = item.get("anonymity");
      test2 = item.id;
      console.log(test1);
      console.log(test2);


    },
    error: function(object, error) {
      console.log("Error when updating todo item: " + error.code + " " + error.message);
    }

  });//get function 

}); //on function


});//Y node

});//document ready