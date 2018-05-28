const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai')(ai_token);
const request = require('request');
var cityname="";
var countryname="";
var long=0;
var lat=0;
var DB=require('./db');
var FACEBOOK_ACCESS_TOKEN='EAACEdEose0cBAGtgIVNIS9wene4xKl2MGZAlTmZBacniIPJQ4cgdGfqWEas9onmwlaq4uJ4LbZA5DrSt5zTSggslXhwTfO2yF5kcTFeQZCZCtlrvzjCSuVQUzZBRshMDSm0nUTjVfo7h4xwedfQPyoTz8i9RZBttswHTIC4A0H5OSbFZBu8l9dxfwG4pYKwzI34ZD';
var SendResponse=exports.SendResponse=function(senderId, text){
 console.log("sending response");
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
var GetWeatherByCityName=exports.GetWeatherByCityName = function(id) {
 request('http://api.openweathermap.org/data/2.5/weather?q='+cityname+'&APPID=ba25db8f381ce66103009bf7b240c530', function (error, response, body) {
  //console.log('error:', error); 
  //console.log('statusCode:', response && response.statusCode); 
  console.log("body : "+body);
  var c=JSON.parse(body);
  var temp=JSON.stringify(c.main.temp);
  var desc=JSON.stringify(c.weather[0].description);
  var last =desc+" with temperature "+temp;
  console.log("last  = "+last);
  SendResponse(id,last);

});
}
 
var GetWeatherByCoord=exports.GetWeatherByCoord = function(id) {
	request('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&APPID=ba25db8f381ce66103009bf7b240c530', function (error, response, body) {
	console.log('error:', error); 
	console.log('statusCode:', response && response.statusCode); 
	console.log('body:',body);
	var c=JSON.parse(body);
  	var temp=JSON.stringify(c.main.temp);
  	var desc=JSON.stringify(c.weather[0].description);
  	var last =desc+" with temperature "+temp;
	console.log("last  = "+last);
	SendResponse(id,last);
});
}

exports.SendText=function(txt,id,result)
{
	console.log("------------------------>sending text to api ai");
	console.log("txt = "+txt);
	var req=app.textRequest(txt,{
		sessionId:'hamada'
	})
	req.on('response', function(response,obj=result) {
    	console.log(response);
    	cityname="";
    	long=0;
    	lat=0;
    	countryname="";
    	var res=response['result'];
    	var par=res['parameters'];
    	var count = Object.keys(par).length;
    	var mess=res.fulfillment.speech;
    	var met=res['metadata'];
    	var intent=met['intentName'];
    	if(obj['city']!='')
    	{
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
	    		long=par['long'];
	    		if(intent=='city')
	    		{
	    			SendResponse(id,"what about "+cityname+"?");
	    		}
				else if(cityname!='')
				{
					GetWeatherByCityName(id);
				}
				else if(lat!=''&&long!='')
				{
					console.log("lat = "+lat+" long = "+long);
					GetWeatherByCoord(id);
				}

	    	}    		
    	}
    	else
    	{
    		if(intent=='city')
    		{
    			cityname=par['geo-city'];
    			if(cityname!='')
    			{
					DB.conn('u',{id:id},{$set:{id:id,city:cityname}},function(){});
					SendResponse(id,"Great now i can help you with the weather in any area in the world , i can also help you to choose what to wear for your outings , how can you do this ? just type your question like what should i wear or what is the weather in any city/Country in the world");
			    }
    			else
    			{
    				SendResponse(id,"Please tell me your city");
    			}
    		}
    	}

	});
	req.on('error', function(error) {
	    console.log(error);
	});
	req.end();
}