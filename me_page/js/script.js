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


			$("#active_past_queries_list .privacy-level .btn").on('click', function (e) {

				$(".privacy-level .btn").removeClass("active");
				$(this).addClass("active");

			});

			activeQueryList.on('click',"#active_past_queries_list .privacy-level .btn", function (e) {
				
				query = new Parse.Query(KarmaQuery);
				query.get($('.privacy-level').get('id'), {
					success: function(item) {
						privacyLevel = $(".privacy-level .btn .active").text();	
						item.set('privacyLevel', privacyLevel);
						item.save();

						


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