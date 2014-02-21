//me page
$(function(){

	YUI().use('node', function (Y) {
    // Node being used to append recent queries to the my queries section
    myQueriesList = Y.one(".past_queries_section");
    activeQueryList = Y.one('#active_past_queries_list'),
    privateQueryList = Y.one('#private_past_queries_list');
    prevQueryContainer = Y.one(".previous_query_wrapper");

    var responderCount;
    
    Parse.$ = jQuery;

    Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");   

    var user = Parse.User.current();

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

    //display updated Karma point balance

    function displayKarmaPoints() {


      var toast4 = user.get("answersGottenBalance");
      console.log(toast4);

      var toast5 = user.get("friendsInvitedBalance");
      console.log(toast5);

      var toast6 = user.get("answersGivenBalance");
      console.log(toast6);

      var karmaPointsBalance = toast6 + toast5 - toast4;
      
      user.fetch();
      console.log(user.get("karmaPointsBalance"));

      $(".top-navbar-icon.karma-points .badge")
      .html(karmaPointsBalance);

      
      $(".row.scoreboard .scoreboard .karma_points_display")
      .html("<span class='badge'>"+karmaPointsBalance+"</span>");

}//display karma points

function countUserFriends () {

 var user = Parse.User.current();

 user.fetch().then(function (user) {
  user.get('id');

  var userFbID = user.get('fbID');
  console.log(userFbID);

  var userFriendsArray = user.get('fbFriends');
  console.log(userFriendsArray);

  var friendsTotal = 0;

  friendCountQuery = new Parse.Query(Parse.User);
  friendCountQuery.find({
    success: function(results) {

      console.log(results.length);

      for (var i = 0; i<results.length; i++) {
        var friendFbId = results[i].get("fbID");
        console.log(friendFbId);
        function findFriendMatch(friendFbId){
          return $.grep(userFriendsArray, function(n, j){
            return n.id == friendFbId;
          });
        };

        if (findFriendMatch(friendFbId)!= "")
          { friendsTotal = friendsTotal + 1 }
        else { friendsTotal = friendsTotal;
        } 
        console.log(friendsTotal);
        $(".friends_badge").text(friendsTotal);
        user.set("friendsTotal",friendsTotal);
        user.save();
    }//for
  },

  error: function(error) {
    console.log("didn't find parse users!")
  }

  });//friend count query find

    });//fetch

}


putUpUserPic(); 
grabUserName();
displayKarmaPoints();
countUserFriends();

    //load the array of recent active and private queries for the user

    function loadMyActiveQueries () {

    	KarmaQuery = Parse.Object.extend("KarmaQuery");

    	var query = new Parse.Query(KarmaQuery);
    	query.notEqualTo('privacylevel', "Private");
      query.equalTo("asker", user);
      query.ascending("createdAt");


      query.find({
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

function getQueryAnswers () { 

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
                          var formatYesAnswers = Math.max ( 40, (percentYesAnswers/100)*($(window).width() * .80 ));
                          var formatNoAnswers = 0;
                          var noAnswerHide = "hidden";
                          var yesAnswerHide = "";
                          console.log(formatNoAnswers);

                        }

                        else if (percentNoAnswers == 100) {
                          console.log($(window).width());
                          var formatNoAnswers = Math.max ( 40, (percentNoAnswers/100)*($(window).width() * .80 ));
                          var formatYesAnswers = 0;
                          var yesAnswerHide = "hidden";
                          var noAnswerHide = "";
                          console.log(formatNoAnswers);
                          console.log(yesAnswerHide);

                        }

                        else {
                          var formatYesAnswers = (percentYesAnswers/100)*(($(".main_content_container").width()-50) * .95 );
                          var formatNoAnswers =  (percentNoAnswers/100)*(($(".main_content_container").width()-50) * .95 );
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
                          var formatYesAnswers = Math.max ( 90, (percentYesAnswers/100)*($(".previous_query_wrapper").width() * .76 ));
                          var formatNoAnswers = 0;
                          var noAnswerHide = "hidden";
                          var yesAnswerHide = "";
                          console.log(formatNoAnswers);
                          console.log(yesAnswerHide);


                        }

                        else if (percentNoAnswers == 100) {
                          console.log($(window).width());
                          var formatNoAnswers = Math.max ( 90, (percentNoAnswers/100)*($(".previous_query_wrapper").width() * .76 ));
                          var formatYesAnswers = 0;
                          var yesAnswerHide = "hidden";
                          var noAnswerHide = "";
                          console.log(formatNoAnswers);
                          console.log(yesAnswerHide);

                        }
                        else {
                          var formatYesAnswers = (percentYesAnswers/100)*(($(".previous_query_wrapper").width()-85) * .95 );
                          var formatNoAnswers =  (percentNoAnswers/100)*(($(".previous_query_wrapper").width()-85) * .95 );
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



                    }

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
                     timeStamp: val.get('timeStamp'),
                     id: val.id,
                     privacylevel: val.get('privacylevel'),
                     active1: activeSetter1,
                     active2: activeSetter2,
                     active3: activeSetter3,
                     percentYesAnswers: percentYesAnswers,
                     percentNoAnswers: percentNoAnswers,
                     responderCount: responderCount,
                     formatYesAnswers: formatYesAnswers,
                     formatNoAnswers: formatNoAnswers,
                     noAnswerHide: noAnswerHide,
                     yesAnswerHide: yesAnswerHide

                   });


                    activeQueryList.prepend(content);


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

  getQueryAnswers();
  
}); //y Array function

},//success function


});// active query find function

//$("#private_past_queries_list").addClass("hidden");


}//loadMyActiveQueries

function loadMyPrivateQueries () {

  KarmaQuery = Parse.Object.extend("KarmaQuery");

  var query = new Parse.Query(KarmaQuery);
  query.equalTo('privacylevel', "Private");
  query.equalTo("asker", user);
  query.ascending("createdAt");


  query.find({
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

function getQueryAnswers () { 

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
                          var formatYesAnswers = Math.max ( 40, (percentYesAnswers/100)*($(window).width() * .76 ));
                          var formatNoAnswers = 0;
                          var noAnswerHide = "hidden";
                          var yesAnswerHide = "";
                          console.log(formatNoAnswers);

                        }

                        else if (percentNoAnswers == 100) {
                          console.log($(window).width());
                          var formatNoAnswers = Math.max (40, (percentNoAnswers/100)*($(window).width() * .76 ));
                          var formatYesAnswers = 0;
                          var yesAnswerHide = "hidden";
                          var noAnswerHide = "";
                          console.log(formatNoAnswers);
                          console.log(yesAnswerHide);

                        }

                        else {
                          var formatYesAnswers = (percentYesAnswers/100)*(($(".main_content_container").width()-50) * .95 );
                          var formatNoAnswers =  (percentNoAnswers/100)*(($(".main_content_container").width()-50) * .95 );
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
                          var formatYesAnswers = Math.max ( 90, (percentYesAnswers/100)*($(".previous_query_wrapper").width() * .80 ));
                          var formatNoAnswers = 0;
                          var noAnswerHide = "hidden";
                          var yesAnswerHide = "";
                          console.log(formatNoAnswers);
                          console.log(yesAnswerHide);


                        }

                        else if (percentNoAnswers == 100) {
                          console.log($(window).width());
                          var formatNoAnswers = Math.max ( 90, (percentNoAnswers/100)*($(".previous_query_wrapper").width() * .80 ));
                          var formatYesAnswers = 0;
                          var yesAnswerHide = "hidden";
                          var noAnswerHide = "";
                          console.log(formatNoAnswers);
                          console.log(yesAnswerHide);

                        }
                        else {
                          var formatYesAnswers = (percentYesAnswers/100)*(($(".previous_query_wrapper").width()-85) * .95 );
                          var formatNoAnswers =  (percentNoAnswers/100)*(($(".previous_query_wrapper").width()-85) * .95 );
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



                    }

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
                     timeStamp: val.get('timeStamp'),
                     id: val.id,
                     privacylevel: val.get('privacylevel'),
                     active1: activeSetter1,
                     active2: activeSetter2,
                     active3: activeSetter3,
                     percentYesAnswers: percentYesAnswers,
                     percentNoAnswers: percentNoAnswers,
                     responderCount: responderCount,
                     formatYesAnswers: formatYesAnswers,
                     formatNoAnswers: formatNoAnswers,
                     no_answer_hidden: noAnswerHide,
                     yes_answer_hidden: yesAnswerHide

                   });

                    privateQueryList.prepend(content);


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

  getQueryAnswers();
  
}); //y Array function

},//success function


});// active query find function

//$("#private_past_queries_list").addClass("hidden");


}//loadMyActiveQueries

loadMyActiveQueries();
loadMyPrivateQueries();



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


});//node

});//main function