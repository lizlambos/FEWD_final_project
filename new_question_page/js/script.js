/*new query page*/

$(document).ready(function(){

	Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL"); 
	
	function queryCreator () {

		user = Parse.User.current();
		askerName = user.get("username");
		questionText = $("#query_area").val();
		privacyLevel = $("button.active").text();
		var d = new Date();
		var dString = d.toString();
		timeStamp = dString.substring(4,11);
		//yesAnswers = [];
		//noAnswers = [];
		//responders = [];

	KarmaQuery = Parse.Object.extend("KarmaQuery");

	var karmaQuery = new KarmaQuery();

	karmaQuery.set("asker", user);
	karmaQuery.set("askerName", askerName);
	karmaQuery.set("text", questionText);
	karmaQuery.set("privacylevel", privacyLevel);
	karmaQuery.set("timeStamp", timeStamp);
	//karmaQuery.set("yesAnswers", yesAnswers);
	//karmaQuery.set("noAnswers", noAnswers);
	//karmaQuery.set("responders", responders);

	console.log(questionText);
	console.log(privacyLevel);
	console.log(timeStamp);

	var test = karmaQuery.get("askerName");
	console.log(test);
	var test2 = karmaQuery.get("text");
	console.log(test2);
	var test3 = karmaQuery.get("privacylevel");
	console.log(test3);
	console.log(karmaQuery);


//object ID, created at and updated at are generated automatically

karmaQuery.save(null, {
	success: function(karmaQuery) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + karmaQuery.id + 'by' + karmaQuery.authorName +
    	'at' + karmaQuery.createdAt+'.');

},
error: function(karmaQuery, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and description.
    alert('Failed to create new object, with error code: ' + error.description);
}
});

}


$("#kp_button").click(function(){
	$(this).toggleClass("active");
	$("#fb_button").removeClass("active");
	console.log(questionText);
	console.log(privacyLevel);


})	;

$("#fb_button").click(function(){
	$(this).toggleClass("active");
	$("#kp_button").removeClass("active");
	console.log(questionText);
	console.log(privacyLevel);


});

//run query creator on click

$("#submit_button").click(function(){
	queryCreator();
	console.log(user);
	console.log(questionText);
	console.log(privacyLevel);


});

$("#go_button").click(function(){
	queryCreator();
	console.log(user);
	console.log(questionText);
	console.log(privacyLevel);


});

/*Query Collection Model

// friendsactive queries collection
var faQuery = new Parse.Query(karmaQuery);
faQuery.notEqualTo("privacy-level", "private");
faQuery.notEqualTo("asker", user);
var friendsActiveQueries = faQuery.collection();

//users own active queries collection
var maQuery = new Parse.Query(karmaQuery);
maQuery.notEqualTo("privacy-level", "private");
maQuery.equalTo("asker", user);
var myActiveQueries = maQuery.collection();

//users private queries collection
var mpQuery = new Parse.Query(karmaQuery);
mpQuery.equalTo("privacy-level", "private");
mpQuery.equalTo("asker", user);
var myPreviousQueries = mpQuery.collection();

function karmaQuery () {

	var self = this;


	this.karmaQuery.create({
		asker:    Parse.User.current(),
		text:     this.input.val(),
		privacy-level:   this.todos.nextOrder(),
		done:    false,
		user:    Parse.User.current(),
		ACL:     new Parse.ACL(Parse.User.current())
	});

	this.input.val('');
	this.resetFilters();
},

karmaQuery.set = ("asker", user);
karmaQuery.set = ("text", questionText);
karmaQuery.set = ("privacy-level", privacyLevel);
karmaQuery.set = ("yesAnswers", totalYesAnswers);
karmaQuery.set = ("noAnswers", totalNoAnswers);
karmaQuery.set = ("responders", responders); 

}

*/



})