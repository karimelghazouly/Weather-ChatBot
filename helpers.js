const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai')(ai_token);
const request = require('request');
var cityname="";
var countryname="";
var long=0;
var lat=0;
var FACEBOOK_ACCESS_TOKEN='EAACEdEose0cBAGtgIVNIS9wene4xKl2MGZAlTmZBacniIPJQ4cgdGfqWEas9onmwlaq4uJ4LbZA5DrSt5zTSggslXhwTfO2yF5kcTFeQZCZCtlrvzjCSuVQUzZBRshMDSm0nUTjVfo7h4xwedfQPyoTz8i9RZBttswHTIC4A0H5OSbFZBu8l9dxfwG4pYKwzI34ZD';
const SendResponse = (senderId, text) => {
 request({
 url: 'https://graph.facebook.com/v2.6/393368691140430/messages?access_token=EAACaCYfZCz74BALYXfZAjFsQUxlWM0UfiZAob8VqtEPl9P5dEvaGU4wzW46WqCcf3oWoDjKTAzZBdJe75zR6T8BrQItvzLZC6u6LWHq8fIzEpqTU3kicvHQwaEm6cX5NAVGpleASe28bbULuAChxfH5tPyvmPV30Cu8l6VoeC5wZDZD',
 messaging_type: "RESPONSE",
 method: 'POST',
 json: {
 recipient: { id: senderId },
 message: { text:text },
 }
 });
 console.log("done");
};
const GetWeatherByCityName = () => {
 request('http://api.openweathermap.org/data/2.5/weather?q='+cityname+'&APPID=ba25db8f381ce66103009bf7b240c530', function (error, response, body) {
  console.log('error:', error); 
  console.log('statusCode:', response && response.statusCode); 
  var wea=body['weather'];
  var desc=wea['description'];
  var maain=body['main'];
  var temp=maain['temp'];
  return ("description:"+desc+" Temperature : "+temp);
});
 
};
exports.SendText=function(txt,id)
{
	console.log("------------------------>sending text to api ai");
	console.log("txt = "+txt);
	var req=app.textRequest(txt,{
		sessionId:'hamada'
	})
	req.on('response', function(response) {
    	console.log(response);
    	cityname="";
    	long=0;
    	lat=0;
    	countryname="";
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
    		cityname=par['geo-city'];
    		countryname=par['geo-country'];
    		lat=par['lat'];
    		long=par[long];
			if(cityname!='')
			{
				var ret=GetWeatherByCityName();
				SendResponse(id,ret);
			}    		

    	}
	});
	req.on('error', function(error) {
	    console.log(error);
	});
	req.end();
}