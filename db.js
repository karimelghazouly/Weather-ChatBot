const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://karimelghazouly:1234567gg@ds237610.mlab.com:37610/users';
const dbName = 'users';
const objj = { name: "Testing user", FBID: "123123" };
exports.conn=function(op,obj,nobj,fun)
{
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("users");
	  if(op=='f')
	  {
	  	dbo.collection("users").findOne(obj, function(err, result) {
		    if (err) throw err;
		    console.log("result",result);
		    fun(result);
		    db.close();
	  	});	
	  }
	  else if(op=='i')
	  {
	  	dbo.collection("users").insertOne(obj, function(err, res) {
		    if (err) throw err;
		    console.log("insertion complete");
		    fun();
		    db.close();
		});
	  }
	  else if(op=='u')
	  {
		var newvalues = nobj;
	    dbo.collection("users").updateOne(obj, newvalues, function(err, res) {
		    if (err) throw err;
		    console.log("1 document updated");
		    db.close();
	    });
	  }
	  else db.close();

	});

}
