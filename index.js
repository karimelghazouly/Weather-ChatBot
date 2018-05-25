var express = require('express')
const path = require('path')
var bp=require('body-parser');
var app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/',function(req,res){
	//console.log("wslt la hna ");
	res.send("el btngan el ahmr");

})

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }

});

app.get('/webhook', (req, res) => {
  console.log("ay haga hna ");
  let VERIFY_TOKEN = 'ghazouly'
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  console.log("mode = "+mode);
  console.log("token = "+token);
  console.log("original = "+VERIFY_TOKEN);
  console.log("cha = "+challenge);
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      res.sendStatus(403);      
    }
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Webhook server is listening, port 3000'));