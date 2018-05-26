var express = require('express')
const path = require('path')
var bp=require('body-parser');
var app = express();
var txt=""
var id=0
var helper = require('./helpers');
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
const assert = require('assert');
const user='karimelghazouly';
const password='1234567gg';
const url = f('mongodb://%s:%s@ds237610.mlab.com:37610/users',user,password);

const dbName = 'users';

MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});


app.listen(process.env.PORT || 3000, () => console.log('webhook is running'));