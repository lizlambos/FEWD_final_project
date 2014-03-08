/*new query page*/

$(document).ready(function(){

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


//upload picture

$("#pic_button").click(function () {
  $("#queryPicUpload").trigger('click');
});

var queryPic = $("#queryPicUpload")[0];

$("#queryPicUpload").click(function(){

console.log(queryPic);


});


function queryCreator () {

  var user = Parse.User.current();
  console.log(user);
		//user.fetch();
		askerName = user.get("username");
		console.log(askerName);
		questionText = $("#query_area").val();
		privacyLevel = $("button.active").text();
		var d = new Date();
		var dString = d.toString();
		timeStamp = dString.substring(4,11);
    var file = queryPic.files[0];

		KarmaQuery = Parse.Object.extend("KarmaQuery");

		var karmaQuery = new KarmaQuery();

		karmaQuery.set("asker", user);
		karmaQuery.set("askerName", askerName);
		karmaQuery.set("text", questionText);
		karmaQuery.set("privacylevel", privacyLevel);
		karmaQuery.set("timeStamp", timeStamp);
		karmaQuery.set("responderCount",0);
		karmaQuery.set("noResponderCount",0);
		karmaQuery.set("yesResponderCount",0);

    if (queryPic.files.length > 0) {
  var file = queryPic.files[0];
  var name = "queryPic.jpg";

  var parseFile = new Parse.File(name, file);

    parseFile.save().then(function() {
   console.log("photo saved");
   
 }, function(error) {
   console.log("photo save error");
 });

    karmaQuery.set("queryPic", file);
}



    

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

//object ID, created at and updated at are generated automatically

karmaQuery.save({
	success: function(karmaQuery) {
		

    // Execute any logic that should take place after the object is saved.
    //alert('New object created with objectId: ' + karmaQuery.id + 'by' + karmaQuery.authorName +
    	//'at' + karmaQuery.createdAt+'.');

},
error: function(karmaQuery, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
  }
}).then(function(){
	$("#made_answer").removeClass("hidden");
  $("#made_answer").parents(".outer").removeClass("hidden");
});

var test = karmaQuery.get("askerName");
console.log(test);
var test2 = karmaQuery.get("text");
console.log(test2);
var test3 = karmaQuery.get("privacylevel");
console.log(test3);
console.log(karmaQuery);

}//query Creator


//$(".help_block_character_count").text(questionLength);


function karmaPointsWarning () {

	var questionLength = $("#query_area").val().length;
	console.log(questionLength);

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



       //also invite to add more friends if setting is FB only and user has <5 friends on KP

       friendsTotal = user.get("friendsTotal");
       console.log(friendsTotal);
       console.log($("button.active").text());
       var wantsKPWarning = user.get("wantsKPWarning");
       console.log(friendsTotal);
       var wantsFriendsWarning = user.get("wantsFriendsWarning");
       console.log(friendsTotal);

       if (karmaPointsBalance <= 0 && wantsKPWarning != false)	{
        $("#need_points .popup_text.first").html("You have "+karmaPointsBalance+" Karma Points");
        $("#need_points").removeClass("hidden");
        $('#need_points').parents(".outer").removeClass("hidden");

      }

      else if ($("button.active").text() == "FB Friends" && 
        user.get("friendsTotal" && wantsFriendsWarning != false) <= 5) {
        if(friendsTotal !=1) {
          $("#need_friends .popup_text.first").html("You have "+friendsTotal+" friends who can answer your query");
        }
        else {
          $("#need_friends .popup_text.first").html("You have "+friendsTotal+" friend who can answer your query");

        }
        $("#need_friends").removeClass("hidden");
        $('#need_points').parents(".outer").removeClass("hidden");
        
      }
      else {
        queryCreator();
      }

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



}


$("#need_points").on("click", ".later_button", function(){
  var isChecked = $(this).parents(".helper_popup").children("#points_checker").prop("checked");
  if (isChecked == true) {
    user.set("wantsKPWarning", false);
    user.save({
      success:function() {
        console.log("user updated kp warning saved");
      },
      error: function(){
        console.log("user updated kp warning not saved");
      }

    }).then(function(){
      $(this).parents(".helper_popup").fadeOut("slow");
      $(this).parents(".outer").addClass("hidden");
      queryCreator();
    });

  }
  else {
    $(this).parents(".helper_popup").fadeOut("slow");
    $(this).parents(".outer").addClass("hidden");
    queryCreator();
  }

});

$("#need_friends").on("click", ".later_button", function(){
  var isChecked = $(this).parents(".helper_popup").children("#friends_checker").prop("checked");
  if (isChecked == true) {
    user.set("wantsFriendsWarning", false);
    user.save({
      success:function() {
        console.log("user updated friends warning saved");
      },
      error: function(){
        console.log("user updated friends warning not saved");
      }

    }).then(function(){
      $(this).parents(".helper_popup").fadeOut("slow");
      $(this).parents(".outer").addClass("hidden");
      queryCreator();
    });

  }
  else {
    $(this).parents(".helper_popup").fadeOut("slow");
    $(this).parents(".outer").addClass("hidden");
    queryCreator();
  }

});

$("#made_answer").on("click", "#question_reloader", function(){
  location.reload();

});




$("#kp_button").click(function(){
	$(this).toggleClass("active");
	$("#fb_button").removeClass("active");
	console.log(questionText);
	console.log(privacyLevel);


})	;

$("#fb_button").click(function(){
	$(this).toggleClass("active");
	$("#kp_button").removeClass("active");
	console.log(questionText);
	console.log(privacyLevel);


});

//run query creator on click

$("#submit_button, #go_button").click(function(){	
	karmaPointsWarning();
	console.log(user);
	

});




})