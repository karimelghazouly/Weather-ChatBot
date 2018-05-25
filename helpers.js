const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai')(ai_token);
exports.SendText=function(txt)
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
    	if(count==0)
    	{

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
exports.SendResponse=function(txt)
{
	
}