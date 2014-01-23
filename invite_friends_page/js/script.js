$(document).ready(function(){
	
	$(".navbar-brand").click(function(){
		alert("jquery working")
	})

	function loadFriendList () {

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




})