//me page
$(function(){

	YUI().use('node', function (Y) {
    // Node being used to append recent queries to the my queries section

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



    var myQueriesList = Y.Node.create(".past_queries_section");
      activeQueryList = Y.one('#active_past_queries_list'),
      privateQueryList = Y.one('#private_past_queries_list');

   function loadMyQueries () {

   			var activeQueryList = Y.one("#active_past_queries_list");

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
					timeStamp: val.get('createdAt'),
					id: val.id

				});
				
				activeQueryList.prepend(content);
				
			});

		}
	});

			//When the checkbox is clicked for any of the items in the incomplete list, update it as complete.
			/*incompleteItemList.delegate('click', function (e) {
						var self = this;
						query = new Parse.Query(ListItem);
						query.get(self.one('input').get('id'), {
							success: function(item) {
								item.set('isComplete', true);
								item.save();
								self.remove();

								if (incompleteItemList.all('li').size() >= 1) {
									noTasksMessage.removeClass('hidden');
								}
								
							},
							error: function(object, error) {
								alert("Error when updating todo item: " + error.code + " " + error.message);
							}
						});
					}, 'li');
				},
				error: function(error) {
					alert("Error when retrieving Todos: " + error.code + " " + error.message);
				}
			});

    	query.find({
    		success:function(results) {

    			Y.one(".past_queries_section").append('<div class="previous_query_wrapper">
    				<div class="label_wrapper">
    				<label class="label label-default time-label"><span class="glyphicon glyphicon-time"></span>4 days</label>
    				<div class="btn-group privacy-level">
    				<button type="button" class="btn kp_button">All KP</button>
    				<button type="button" class="btn fb_button active">FB Friends</button>
    				<button type="button " class="btn private_button">Private</button>
    				</div><!--btn-group-->
    				</div><!--label_wrapper-->

    				<div class="question">
    				<p>Am I annoying when I drink at parties?</p>    
    				</div>
    				<div class="answers">
    				<div class="yes-answer"><span class="result">78%</span></div> 
    				<div class="na-answer">&#xe606;<p class="responder_count">47</p></div>
    				<div class="no-answer"><span class="result">20%</span></div>
    				</div>

    				</div><!--previous_query_wrapper-->'
    				)

    		},
    		error:function(results){

    		}

    	});*/

}


$(".query_nav_buttons button").click(function(){
	$(this).toggleClass("active");
	loadMyQueries();
});

});

});

});