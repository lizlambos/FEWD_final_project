/*new query page*/

$(function(){

	Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL"); 
	
	var user = Parse.User.current();
	var authorName = "default";
	var questionText = "default";
	var privacyLevel = "default";

function queryCreator () {	

	var KarmaQuery = Parse.Object.extend("KarmaQuery"/*,{

		defaults:{
			asker: user,
			askerName : "default",
			questionText : "default",
			privacyLevel : "default"
		},

		settings: function(){
			this.asker = user;
			this.askerName = user.get("username");
			console.log(askerName);
			this.questionText = $("#query_area").val();
			console.log(questionText);
			this.privacyLevel = $("button.active").text();
			console.log(privacyLevel);

		}

	}*/);

	var karmaQuery = new KarmaQuery();

	karmaQuery.set = ("asker", user);
	karmaQuery.set = ("askerName", authorName);
	karmaQuery.set = ("text", questionText);
	karmaQuery.set = ("privacylevel", privacyLevel);

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


	var test = karmaQuery.get("askerName");
	console.log(test);
	var test2 = karmaQuery.get("text");
	console.log(test2);
	var test3 = karmaQuery.get("privacylevel");
	console.log(test3);
	console.log(karmaQuery);

}

	/*//these come later from being answered/
	karmaQuery.set = ("yesAnswers", totalYesAnswers);
	karmaQuery.set = ("noAnswers", totalNoAnswers);
	karmaQuery.set = ("responders", responders); //responder array */
//object ID, created at and updated at are generated automatically

$("div.privacy-level > button").click(function(){
	$(this).addClass("active");
})	

/*function queryCreator () {

	var self = this;

	 this.karmaQuery.create({
       
        askerName: user.get("username"),
		
		questionText: $("#query_area").val(),
	
		privacyLevel : $("button.active").text()
		
      });

	var test = karmaQuery.get("askerName");
	console.log(test);
	var test2 = karmaQuery.get("text");
	console.log(test2);
	var test3 = karmaQuery.get("privacylevel");
	console.log(test3);
	console.log(karmaQuery);

	
}*/



//run query creator on click

$("#submit_button").click(function(){
	queryCreator();
	console.log(user);


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