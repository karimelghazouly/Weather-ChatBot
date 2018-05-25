const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai');
exports.SendText=function(txt)
{
	console.log("sending text to api ai");
	var req=app.textRequest(txt,{
		sessionid:'hamada'
	})
	request.on('response', function(response) {
    console.log(response);
	});
	request.on('error', function(error) {
	    console.log(error);
	});
}