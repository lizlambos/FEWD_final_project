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

		function loadFriendQueries(){

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

			function getAskerPic() {
				query = new Parse.Query(User);
				query.get(askerID, {
					success: function(item) {
						askerPic = item.get('userPic');
						console.log(askerPic);
					//$(".fbpic_small").attr("src",askerPic)
					
					var content = Y.Lang.sub(Y.one('#friends_queries_section').getHTML(), {
						queryText: val.get('text'),
						timeStamp: val.createdAt,
						askerName: val.get('askerName'),
						id: val.id,
						privacylevel: val.get('privacylevel'),
						askerPicURL: askerPic


					});

					allKPQueryColumn1.prepend(content);



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

	loadFriendQueries();


	
function answerQuery() {

	user = Parse.User.current();
<<<<<<< HEAD
	answer = $(".answers .btn.active").attr("name");
	console.log(answer);
	answererName = user.get("username");
	var d = new Date();
	var dString = d.toString();
	timeStamp = dString.substring(4,11);
	queryID = $(".answers .btn.active").attr("id");
	console.log(queryID);
	//testing = $(this).text();
	//console.log(testing);
=======
	answer = $(this).attr("name");
	answererName = user.get("username");
	console.log(answer);
	var d = new Date();
	var dString = d.toString();
	timeStamp = dString.substring(4,11);
	queryID = $(this).attr("value");
>>>>>>> 5102ececf7b07b7f5b77729ce47f3743908d6113


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

<<<<<<< HEAD
	$("#allKP_active_queries_list").on("click",".answers .btn", function(){
		
		$(".answers .btn").removeClass("active");
		$(this).addClass("active");
		answerQuery();
	});

	


=======

	$("#yes-button").click(function(){
		answerQuery();
	})



	$("#no-button").click(function(){
		answerQuery();
		addClass("green");

	})	;

>>>>>>> 5102ececf7b07b7f5b77729ce47f3743908d6113

});//YUI

});//document.ready