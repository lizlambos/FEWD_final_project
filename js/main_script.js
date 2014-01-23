$(document).ready(function(){

//creating new user, not sure how to do this w/ FB login	

var user = new Parse.User();
user.set("username", "liz nambos");
user.set("password", "nass");
user.set("email", "niz@example.com");
  
  
user.signUp(null, {
  success: function(user) {
    // Hooray! Let them use the app now.
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

//not sure how sheets read scripts written on html doc
$("#fb_login_button").click(function(){
	fb_login();
});



/* what user data looks like

{ "session_token": "wnc5c6b44m7n2fk74ul4hujuk", 
"auth_data": { 
	"facebook": { 
		"id": "605697", 
		"access_token": "CAADnyIkAxgUBAFBK6p9y56VcC7ZBI7z47hPjvXMZBEEkFRhSTyC9GQBETuApRO86Mh7B42OoujNPadcVeHJg39rn5sF7rZBT5zth120ij7Egxxz7ZB9kCw77EdPzKyDiBs4AyM9feUO3pmRhFcJLvZCL65Qcq35hPOIyR2RZA0ofUIBV0ae5iGrjrPShYcrIbBRMJEiXTYbKbDk1jRQ7h2yAODOas7Bb4ZD", 
		"expiration_date": "2014-03-21T21:01:32.915Z" 
		} 
	}, 
"id": "r9dVzEko4H", 
"data": { 
	"username": "yklsuokr249gaysqkgo4rqozg" }, 
	"created_at": "2014-01-20T21:01:35Z", 
	"updated_at": "2014-01-20T21:01:35Z" }*/


//create new query 





});