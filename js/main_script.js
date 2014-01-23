$(document).ready(function(){

 Parse.initialize("x03F3RJiRYdtYPfeS7AHNOEDHL0cx2nzzJ4ztDOX", "mYTgTArAtPa24wEcsXfUQYT6NQmI0iG5iR6xHHDL");   

//translate FBlogin generated username into a real username

  }


  function getUserInfo() {
        FB.api('/me', function(response) {
          var name = response.name;
          var id = response.id;
          //document.getElementById("status").innerHTML=str;
            console.log(name);
  

      
    }



    /*function getPhoto()
    {
      FB.api('/me/picture?type=normal', function(response) {
 
          var pic ="<img src='"+response.data.url+"'/>";
          document.getElementById("user_FB_pic").innerHTML+=pic;
 
    });


      });*/

/*not sure how sheets read scripts written on html doc
*/



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