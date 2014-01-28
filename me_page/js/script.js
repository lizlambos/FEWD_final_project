//me page
$(function(){

	YUI().use('node', function (Y) {
    // Node being used to append recent queries to the my queries section
    myQueriesList = Y.one(".past_queries_section");
    activeQueryList = Y.one('#active_past_queries_list'),
    privateQueryList = Y.one('#private_past_queries_list');
    prevQueryContainer = Y.one(".previous_query_wrapper");

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


    	if ( $("#active_queries").hasClass("active") == true) {

    		KarmaQuery = Parse.Object.extend("KarmaQuery");

    		maQuery = new Parse.Query(KarmaQuery);
    		maQuery.notEqualTo("privacylevel", "private");
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

				var content = Y.Lang.sub(Y.one('#past_queries_section').getHTML(), {
					queryText: val.get('text'),
					timeStamp: val.createdAt,
					id: val.id,
					privacylevel: val.get('privacylevel'),
					active1: activeSetter1,
					active2: activeSetter2,
					active3: activeSetter3
				});

				
				
				activeQueryList.prepend(content);
				
				
			});

			

			

			var privacyLevelButtons = Y.one(".privacy-level");

			var privacyLevelActive = Y.one(".privacy-level .btn.active");
			var newPrivacyLevel = privacyLevelActive.get("text");
			
	//allow the user to change the privacy level of the question via the button

	$(".privacy-level .btn").click(function () {

		$(this).siblings(".btn").removeClass("active");
		$(this).addClass("active");
		newPrivacyLevel = $(this).text();
		console.log(newPrivacyLevel);

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


		});

	});

},


});

}

else {



	KarmaQuery = Parse.Object.extend("KarmaQuery");

	maQuery = new Parse.Query(KarmaQuery);
	maQuery.equalTo("privacylevel", "private");
	maQuery.equalTo("asker", user);
	maQuery.ascending("createdAt");

	var myActiveQueries = maQuery.collection();
	console.log(myActiveQueries);

	maQuery.find({
		success: function(results) {
			console.log(results.length);

			//Append each of the active queries to the active queries list
			Y.Array.each(results, function(val, i, arr) {
				var content = Y.Lang.sub(Y.one('#past_queries_section').getHTML(), {
					queryText: val.get('text'),
					timeStamp: val.createdAt,
					id: val.id

				});
				

				privateQueryList.prepend(content);
				
			});

		}
	});



}


}

loadMyQueries();


$("#active_queries").click(function(){
	$(".query_nav_buttons button").toggleClass("active");
	$("#private_past_queries_list").addClass("hidden");
	$("#active_past_queries_list").removeClass("hidden");

});

$("#past_queries").click(function(){
	$(".query_nav_buttons button").toggleClass("active");
	$("#private_past_queries_list").removeClass("hidden");
	$("#active_past_queries_list").addClass("hidden");

});



    	//allow to update the privacy level by clicking the button





    });

});

});