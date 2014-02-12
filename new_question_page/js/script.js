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
	location.reload(true);
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

       if (karmaPointsBalance <= 0)	{
       	$("body").prepend("<div class='helper_popup' id='need_points'><p class='popup_text first'>You have "+karmaPointsBalance+" Karma Points</p><p class='popup_text'> Get more points so friends can answer your Karma Queries</p><div class='btn_wrapper'><a href='../get_karma_page/index.html' class='btn btn-success'>Sounds Great</a><a href='#' class='btn btn-warning later_button'>Later</a></div><input class='user_pref_checkbox' type='checkbox' name='user_pref' value='no_karma_points_reminders'> <p class='user_pref_checkbox_label'>Don't nag me about this anymore</p></div>");}

       else if ($("button.active").text() == "FB Friends" && 
        user.get("friendsTotal") <= 5) {
  
        $("body").prepend("<div class='helper_popup' id='need_points'><p class='popup_text first'>You have "+friendsTotal+" friends who can answer your query</p><p class='popup_text'> Expand your audience by inviting more friends</p><div class='btn_wrapper'><a href='../invite_friends_page/index.html' class='btn btn-success'>Sounds Great</a><a href='#' class='btn btn-warning later_button'>Later</a></div><input class='user_pref_checkbox' type='checkbox' name='user_pref' value='no_karma_points_reminders'> <p class='user_pref_checkbox_label'>Don't nag me about this anymore</p></div>");
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


$("body").on("click", ".later_button", function(){
	$(this).parents(".helper_popup").fadeOut("slow");
	queryCreator();

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

$("#submit_button").click(function(){	
	karmaPointsWarning();
	console.log(user);
	

});

$("#go_button").click(function(){
	karmaPointsWarning();
	console.log(user);



});



})