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

		name = user.get("username");
		console.log(name);

		var toast = user.get("answersGottenBalance");
		console.log(toast);

		var toast2 = user.get("friendsInvitedBalance");
		console.log(toast2);

		var toast3 = user.get("answersGivenBalance");
		console.log(toast3);

		var karmaPointsBalance = toast3 + toast2 - toast;

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

	$(".top-navbar-icon .badge")
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

function setQueryAnswer() {

	user = Parse.User.current();
	answer = $(".answers .btn.active").attr("name");
	console.log(answer);
	answererName = Parse.User.current().get("username");
	var d = new Date();
	var dString = d.toString();
	timeStamp = dString.substring(4,11);
	queryID = $(".answers .btn.active").attr("id");
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

	$(".top-navbar-icon .badge")
	.html(karmaPointsBalance);

}//increment score

//reveal answers

function revealAnswers(){

	var QueryAnswer = Parse.Object.extend("QueryAnswer");
	answerQuery = new Parse.Query(QueryAnswer);
	answerQuery.equalTo("queryID",queryID);
	answerQuery.ascending("createdAt");

	answerQuery.find({
		success: function(totalResults) {
			var responderCount = totalResults.length;
			console.log(totalResults.length);

			yesQuery = new Parse.Query(QueryAnswer);
			yesQuery.equalTo("queryID", queryID);
			yesQuery.equalTo("answer", "yes");

			yesQuery.find({
				success: function(yesResults) {
					var yesResponderCount = yesResults.length;
					console.log(yesResults.length);
					var percentYesAnswers = Math.round(
						(yesResponderCount / responderCount)*100);

					noQuery = new Parse.Query(QueryAnswer);
					noQuery.equalTo("queryID",queryID);
					noQuery.equalTo("answer", "no");

					noQuery.find({
						success: function(noResults) {
							var noResponderCount = noResults.length;
							console.log(noResults.length);
							console.log(responderCount);
							console.log(yesResponderCount);
							console.log(noResponderCount);

							var percentNoAnswers = Math.round(
								(noResponderCount / responderCount)*100);

							console.log(percentYesAnswers);
							console.log(percentNoAnswers);


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

			});//no find
				},
				error: function(object, error) {
					alert("Error when updating todo item: " + error.code + " " + error.message);
				}

			});//yes find

},
error: function(object, error) {
	alert("Error when updating todo item: " + error.code + " " + error.message);
}

			});//get find

	}//reveal  query answers

	$("#allKP_active_queries_list").on("click",".answers .btn", function(){

		$(".answers .btn").removeClass("active");
		$(this).addClass("active");

		setQueryAnswer();

		incrementScore();

		var queryID = $(this).attr("id");
		console.log(queryID);
		revealAnswers();

	});

	//delete button to hide queries

	$("#allKP_active_queries_list").on("click",".delete-button", function(){
		$(this).parents(".parent_row").addClass("hidden");
	});

	



});//YUI

});//document.ready