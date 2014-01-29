//me page
$(document).ready(function(){

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

    //get user name and fb photo to display on me page

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

    $(document).ready(function(){

    	putUpUserPic();	
    	grabUserName();

    //load the array of recent active and private queries for the user

    function loadMyQueries () {

    	KarmaQuery = Parse.Object.extend("KarmaQuery");

    	maQuery = new Parse.Query(KarmaQuery);
    	maQuery.notEqualTo("privacylevel", "Private");
    	maQuery.equalTo("asker", user);
    	maQuery.ascending("createdAt");

    	var myActiveQueries = maQuery.collection();
    	console.log(myActiveQueries);



    	maQuery.find({
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


function getActiveQueryAnswers () { 

	var QueryAnswer = Parse.Object.extend("QueryAnswer");
	answerQuery = new Parse.Query(QueryAnswer);
	answerQuery.equalTo("queryID",val.id);
	answerQuery.ascending("createdAt");

	answerQuery.find({
		success: function(totalResults) {
			var responderCount = totalResults.length;
			console.log(totalResults.length);
			console.log(val.id);

			yesQuery = new Parse.Query(QueryAnswer);
			yesQuery.equalTo("queryID",val.id);
			yesQuery.equalTo("answer", "yes");

			yesQuery.find({
				success: function(yesResults) {
					var yesResponderCount = yesResults.length;
					console.log(yesResults.length);
					var percentYesAnswers = (yesResponderCount / responderCount)*100;

					noQuery = new Parse.Query(QueryAnswer);
					noQuery.equalTo("queryID",val.id);
					noQuery.equalTo("answer", "no");

					noQuery.find({
						success: function(noResults) {
							var noResponderCount = noResults.length;
							console.log(noResults.length);
							console.log(responderCount);
							console.log(yesResponderCount);
							console.log(noResponderCount);
							console.log(val.id);
							var percentNoAnswers = (noResponderCount / responderCount)*100;

							var content = Y.Lang.sub(Y.one('#past_queries_section').getHTML(), {
								queryText: val.get('text'),
								timeStamp: val.createdAt,
								id: val.id,
								privacylevel: val.get('privacylevel'),
								active1: activeSetter1,
								active2: activeSetter2,
								active3: activeSetter3,
								percentYesAnswers: percentYesAnswers,
								percentNoAnswers: percentNoAnswers,
								responderCount: responderCount

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

},
error: function(object, error) {
	alert("Error when updating todo item: " + error.code + " " + error.message);
}

			});//get find

	}//get active query answers

	getActiveQueryAnswers();
	

}); //y Array function

},//success function


});// active query finrfind function

mpQuery = new Parse.Query(KarmaQuery);
mpQuery.equalTo("privacylevel", "Private");
mpQuery.equalTo("asker", user);
mpQuery.ascending("createdAt");

var myPastQueries = mpQuery.collection();
console.log(myPastQueries);

mpQuery.find({
	success: function(results) {
		console.log(results.length);

//Append each of the privacte queries to the private queries list
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

	//retrieve the answers for each query

	function getPrivateQueryAnswers () { 

		var QueryAnswer = Parse.Object.extend("QueryAnswer");
		answerQuery = new Parse.Query(QueryAnswer);
		answerQuery.equalTo("queryID",val.id);
		answerQuery.ascending("createdAt");

		answerQuery.find({
			success: function(totalResults) {
				var responderCount = totalResults.length;
				console.log(totalResults.length);
				console.log(responderCount);

				yesQuery = new Parse.Query(QueryAnswer);
				yesQuery.equalTo("queryID",val.id);
				yesQuery.equalTo("answer", "yes");

				yesQuery.find({
					success: function(yesResults) {
						var yesResponderCount = yesResults.length;
						console.log(yesResults.length);
						var percentYesAnswers = (yesResponderCount / responderCount)*100;

						noQuery = new Parse.Query(QueryAnswer);
						noQuery.equalTo("queryID",val.id);
						noQuery.equalTo("answer", "no");

						noQuery.find({
							success: function(noResults) {
								var noResponderCount = noResults.length;
								console.log(noResults.length);
								console.log(responderCount);
								console.log(yesResponderCount);
								console.log(noResponderCount);
								console.log(val.id);
								var percentNoAnswers = (noResponderCount / responderCount)*100;

								var content = Y.Lang.sub(Y.one('#past_queries_section').getHTML(), {
									queryText: val.get('text'),
									timeStamp: val.createdAt,
									id: val.id,
									privacylevel: val.get('privacylevel'),
									active1: activeSetter1,
									active2: activeSetter2,
									active3: activeSetter3,
									percentYesAnswers: percentYesAnswers,
									percentNoAnswers: percentNoAnswers,
									responderCount: responderCount

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

},
error: function(object, error) {
	alert("Error when updating todo item: " + error.code + " " + error.message);
}

			});//get find

	}//get private query answers

	getPrivateQueryAnswers();

});//yArray

}//success


});//find

$("#private_past_queries_list").addClass("hidden");




}//loadMyQueries

loadMyQueries();


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

	});//click function

// update the queries responder count using the responderCount data shown here
function updateResponderCount()	{

	$(".responder_count").each(function(){
		var attrID = $(this).attr("id");
		var responderNumber = $(this).text();
		console.log(responderNumber);

		var KarmaQuery = Parse.Object.extend("KarmaQuery");

		query = new Parse.Query(KarmaQuery);
		query.get($(this).attr('id'), {
			success: function(item) {
				item.set('responderCount', responderNumber);
				test = item.get("responderCount");
				console.log(test);
				item.save();

			},
			error: function(object, error) {
				alert("Error when updating todo item: " + error.code + " " + error.message);
			}


		});//get function

})//each function

}//update responder count

updateResponderCount();


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



    });//doc.ready

});//node

});//main function