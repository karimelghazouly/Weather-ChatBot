var express = require('express')
const path = require('path')
var bp=require('body-parser');
var app = express();
var helper=require('./helpers');
var DB=require('./db');
var txt="";
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
      DB.conn('f',{id:id},{},function(result,idx=id,helperrr=helper){
      	console.log("result",result);
      		if(result==null||result.length==0)
      		{
      			console.log("idx = "+idx);
      			DB.conn('i',{id:id,city:''},{},function(){})
      			helperrr.SendResponse(id,"Hello, My name is hoksha i'm a weather bot ,As i can see you are a new user ,So Please tell me where do you live ?");
      		}
      		else
      		{
      			helperrr.SendText(txt,id,result);
      		}
      })
  	  //console.log(webhook_event);
    });
    res.status(200).send('EVENT_RECEIVED');
    
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



app.listen(process.env.PORT || 3000, () => console.log('webhook is running'));