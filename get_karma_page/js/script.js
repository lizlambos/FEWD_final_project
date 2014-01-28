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
				

			}//get asker pic

			
			getAskerPic();
			

			

		});//y.array

	}//success

	});//find

	}//load friend queries

	loadFriendQueries();


});//YUI

});//document.ready