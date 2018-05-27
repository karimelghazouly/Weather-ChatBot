var express = require('express')
const path = require('path')
var bp=require('body-parser');
var app = express();
var txt=""
var id=0
var helper = require('./helpers');
var dbo;
var DB;
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/',function(req,res){
	res.send("hello! server is running");
})

app.post('/webhook', (req, res) => {  
 console.log("post request message coming");
  let body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      let m = webhook_event['message']
      txt=m['text']
      id=webhook_event.sender['id'];
  	  console.log(webhook_event);
    });
    res.status(200).send('EVENT_RECEIVED');
    var check=CheckNewUser("users",{id:id});
    console.log("check : "+check);
    if(check==1)
    {
    	InsertDoc("users",{id:id});
    	var mess="Hi, my name is hoksha i'm a weather bot and i can help you finding the weather in your country pick what you can dress today and if you are travelling check what is the weather in your destination, as i can see you are a new user so please tell me what is the city you live in ?!";
    	helper.SendResponse(id,mess);
    }
    else 
    {
    	var u = findDoc("users",{id:id});
    	console.log(u);
    	helper.SendText(txt,id);
    }
  } else {
    res.sendStatus(404);
  }

});

app.get('/webhook', (req, res) => {
  console.log("Verifying webhook");
  let VERIFY_TOKEN = 'ghazouly'
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      res.sendStatus(403);      
    }
  }
});

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://karimelghazouly:1234567gg@ds237610.mlab.com:37610/users';
const dbName = 'users';
const objj = { name: "Testing user", FBID: "123123" };
function conn(callback)
{
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  dbo = db.db(dbName);
	  DB=db;
	  console.log("connected to mlab");
	  dbo.createCollection("users", function(err, res) {
	    if (err) throw err;
	    console.log("Collection users created!");
	  });
	  //InsertDoc("users",myobj);
	  //findDoc("users");
	  callback();
	}); 

}


function InsertDoc(collection_name,obj){
	conn();
	dbo.collection(collection_name).insertOne(obj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    DB.close();
  	});
}

function CheckNewUser(collection_name,obj){
	console.log("checking....!");
	var ret = findDoc(collection_name,obj);
	console.log("ret = "+ret);
	if(ret==0)return 1;
	else return 0;
}

function findDoc(collection_name,obj)
{
	console.log("connecting");
	conn(function(collection_name,obj){
		dbo.collection(collection_name).find(obj).toArray(function(err, result) {
	    if (err) console.log("err = ",err);
	    console.log("result = ",result);
	    if(result.length==0)
	    	return 0;
	    else return result;
	    DB.close();
	  	});
	});
	console.log("connected");

	

}

app.listen(process.env.PORT || 3000, () => console.log('webhook is running'));