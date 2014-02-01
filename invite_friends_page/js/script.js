$(document).ready(function(){
	
//INITIALIZE NODE

YUI().use('node', function (Y) {

  //INITIALIZE PARSE  

  Parse.$ = jQuery;

  Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX",
   "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");  


user = Parse.User.current();

function populateFriendList () {

	FB.api('/me/friends', { fields : 'id', offset : 0, limit : 25 }, function(response) { 

	 var outstring = '<p>Friends:</p>';
       for (var i=0, l=response.data.length; i<l; i++) {
         var friend = response.data[i];
         outstring = outstring + '<fb:profile-pic uid="' + friend.id + '"  width="50" height="50" ></fb:profile-pic>' 
		                        + '<fb:name uid="' + friend.id + '"></fb:name>&nbsp;&nbsp;&nbsp;'
       }
       document.getElementById('myFriendList').innerHTML = outstring; 
       FB.XFBML.parse(document.getElementById('myFriendList'));

   };

   Y.Array.each(response, function(val, i, arr) {
  	friendName = val.get('asker');
  	console.log(asker);
  	askerID = asker.id;
  	console.log(askerID);
  	askerName = val.get('askerName');
  	console.log(askerName);

  //display the karma points balance on the two scoreboard areas (screen and mobile)  

  $(".row.scoreboard .scoreboard .karma_points_display")
  .html("<span class='badge'>"+karmaPointsBalance+"</span>");

  $(".top-navbar-icon.karma-points .badge")
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
    				timeStamp: val.get('timeStamp'),
    				askerName: val.get('askerName'),
    				id: val.id,
    				privacylevel: val.get('privacylevel'),
    				askerPicURL: askerPic,
    				karmaPointsBal: karmaPointsBalance

    			});

    			contentColumn.prepend(content);
   

	

});//node

});//document ready