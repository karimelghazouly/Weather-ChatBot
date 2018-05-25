const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai')(ai_token);
var request = require('request');
var fb_token='2ecd56ce6c9388693566b68af63b443b';
exports.SendText=function(txt,id)
{
	console.log("sending text to api ai");
	console.log("txt = "+txt);
	var req=app.textRequest(txt,{
		sessionId:'hamada'
	})
	req.on('response', function(response) {
    	console.log(response);
    	var res=response['result'];
    	var par=res['parameters'];
    	var count = Object.keys(par).length;
    	var mess=res.fulfillment.speech;
    	if(count==0)
    	{
    		SendResponse(mess,id);
    	}
    	else
    	{

    	}
	});
	req.on('error', function(error) {
	    console.log(error);
	});
	req.end();
}
exports.SendResponse=function(txt,idx)
{
	var send=function(id,txt){
		request({
			url:'https://graph.facebook.com/v2.6/me/messages',
			 qs: { access_token: fb_token },
			 method: 'POST',
			 json: {
			 recipient: { id: idx },
			 message: { txt },
			 }
		});
	}
}