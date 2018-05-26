var express = require('express')
const path = require('path')
var bp=require('body-parser');
var app = express();
var txt=""
var id=0
var helper = require('./helpers');
var dbo;
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
    helper.SendText(txt,id);
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

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db(dbName);
  console.log("connected to mlab");
  var myobj = { name: "Testing user", FBID: "123123" };
  dbo.createCollection("users-ids", function(err, res) {
    if (err) throw err;
    console.log("Collection users-ids created!");
    db.close();
  });
  InsertDoc("users-ids",myobj);
}); 

function InsertDoc(collection_name,obj){
	dbo.collection(collection_name).insertOne(obj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}

app.listen(process.env.PORT || 3000, () => console.log('webhook is running'));