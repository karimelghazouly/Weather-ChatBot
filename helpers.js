const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai')(ai_token);
const request = require('request');
var fb_token='2ecd56ce6c9388693566b68af63b443b';
exports.SendResponse=function(idx,txt)
{
	var send=function(idx,txt){
		request({
			 url: 'https://graph.facebook.com/v2.6/me/messages',
			 qs: { access_token: fb_token },
			 method: 'POST',
			 json: {
			 recipient: { id: idx },
			 message: { txt },
			 }
			 });
	};
}

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
    		console.log("message = "+mess);
    		SendResponse(id,mess);
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