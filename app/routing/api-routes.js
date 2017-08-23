//require the friends data file
var friends = require('../data/friends.js');

//Routes
module.exports = function(app){

	// API GET Requests
	app.get('/api/friends', function(req, res){
		res.json(friends);
	});

	// API POST Requests
	app.post('/api/friends', function(req, res){

//Comparing user with their best friend match 

//Object to hold the best match
		var bestMatch = {
			name: "",
			photo: "",
			friendDifference: 1000
		};

		// Here we take the result of the user's survey POST and parse it.
		var userData 	= req.body;
		var userName 	= userData.name;
		var userPhoto 	= userData.photo;
		var userScores 	= userData.scores;
		var bestMatchArr = [];


		// Loop through all the friend possibilities in the database. 
		for  (var i=0; i< friends.length; i++) {
			var totalDifArray = [];
			console.log("User: " + friends[i].name);
			var totalDifference = 0;
			var a = i;
			var friendScores = friends[a].scores;
			console.log(friendScores);
	
			// for (var j in friends[a].scores[j]) {
			for (var j=0; j< friendScores.length; j++){
			
				var value = parseInt(userScores[j])-parseInt(friends[a].scores[j]);
				value = Math.abs(value);
				totalDifArray.push(value);
			}
			console.log("Total Dif Array: " + totalDifArray);
			function getSum(total, num) {
				return total + num;
			}
			totalDifference = totalDifArray.reduce(getSum);
			console.log("Total Diff: " + totalDifference);
			bestMatchArr.push(totalDifference);
		}
		console.log("Best Match Array: " + bestMatchArr);

		var index = 0;
		var value = bestMatchArr[0];
		for (var i = 1; i < bestMatchArr.length; i++) {
		  if (bestMatchArr[i] < value) {
			value = bestMatchArr[i];
			index = i;
			console.log("value " + value);
			console.log("indx: " + index);
		  }
		}
				// If the sum of differences is less then the differences of the current "best match"
				//if (totalDifference <= bestMatch.friendDifference){

					// Reset the bestMatch to be the new friend. 
					bestMatch.name = friends[index].name;
					bestMatch.photo = friends[index].photo;
					bestMatch.friendDifference = totalDifference;
				//}
			
		

		// Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
		// the database will always return that the user is the user's best friend).
		friends.push(userData);

		// Return a JSON with the user's bestMatch. This will be used by the HTML in the next page. 
		res.json(bestMatch);

	});

}