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
				var content = Y.Lang.sub(Y.one('#past_queries_section').getHTML(), {
					queryText: val.get('text'),
					timeStamp: val.createdAt,
					id: val.id

				});
				
				activeQueryList.prepend(content);

				
			});

			var privacyLevelActive = Y.one(".privacy-level .btn.active");
			var newPrivacyLevel = privacyLevelActive.get("text");
			
			$(".privacy-level .btn").click(function () {

				$(this).siblings(".btn").removeClass("active");
				$(this).addClass("active");
				newPrivacyLevel = $(this).text();
				console.log(newPrivacyLevel);

				query = new Parse.Query(KarmaQuery);
				query.get(privacyLevelActive.get('id'), {
					success: function(item) {
						item.set('privacyLevel', newPrivacyLevel);
						item.save();
						console.log(newPrivacyLevel);
						test1 = item.get("privacyLevel");
						console.log(test1);
						


					},
					error: function(object, error) {
						alert("Error when updating todo item: " + error.code + " " + error.message);
					}


				});






				/*activeQueryList.on('click', function (e) {
					var self = this;

					var newPrivacyLevel = privacyLevelActive.get("text");
					query = new Parse.Query(KarmaQuery);
					query.get(self.one(".privacy-level .btn").get('id'), {
						success: function(item) {
							newPrivacyLevel = privacyLevelActive.get("text");

							item.set('privacyLevel', newPrivacyLevel);
							item.save();
							console.log(newPrivacyLevel);



						},
						error: function(object, error) {
							alert("Error when updating todo item: " + error.code + " " + error.message);
						}
					},".privacy-level .btn.active");*/
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