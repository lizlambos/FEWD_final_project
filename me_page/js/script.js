//me page

$(function(){

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

	$("#current_user_fbPic").click(function(){

  	putUpUserPic();	

});

})