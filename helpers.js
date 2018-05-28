const ai_token='9cad650e13084baea6efc0fca668b402';
var app = require('apiai')(ai_token);
const request = require('request');
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
 DB.conn("Messages","i",{id:senderId,text:text,fromto:"bot to user"},{},function(){});
 console.log("done");
};
var GetWeatherByCityName=exports.GetWeatherByCityName = function(id,cityname,func) {
 request('http://api.openweathermap.org/data/2.5/weather?q='+cityname+'&APPID=ba25db8f381ce66103009bf7b240c530', function (error, response, body) {
  //console.log('error:', error); 
  //console.log('statusCode:', response && response.statusCode); 
  console.log("body : "+body);
  var c=JSON.parse(body);
  var temp=JSON.stringify(c.main.temp);
  var desc=JSON.stringify(c.weather[0].description);

  
  func(temp,desc,id);

});
}
 
var GetWeatherByCoord=exports.GetWeatherByCoord = function(id,lat,long) {
	request('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&APPID=ba25db8f381ce66103009bf7b240c530', function (error, response, body) {
	console.log('error:', error); 
	console.log('statusCode:', response && response.statusCode); 
	console.log('body:',body);
	var c=JSON.parse(body);
  	var temp=JSON.stringify(c.main.temp);
  	var desc=JSON.stringify(c.weather[0].description);
  	var last =desc+" with temperature "+temp+" kelvin";
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
    	var cn="";
    	var long=0;
    	var lat=0;
    	var res=response['result'];
    	var par=res['parameters'];
    	var count = Object.keys(par).length;
    	var mess=res.fulfillment.speech;
    	var met=res['metadata'];
    	var intent=met['intentName'];

    	if(obj['city']!='')
    	{
    		console.log("user adeem");
			if(count==0)
	    	{
	    		console.log("message = "+mess);
	    		SendResponse(id,mess);
	    	}
	    	else
	    	{
	    		cn=par['geo-city'];
	    		lat=par['lat'];
	    		long=par['long'];
	    		if(intent=='city')
	    		{
	    			console.log("cityyy");
	    			SendResponse(id,"what about "+cn+"?");
	    		}
				else if(cn!=''&&cn!=null&&cn!=undefined)
				{
					console.log("weather city",cn);
					GetWeatherByCityName(id,cn,function(temp,desc,id){
						var last =desc+" with temperature "+temp+" kelvin";
						console.log("last  = "+last);
  						SendResponse(id,last);
					});
				}
				else if(lat!=''&&long!='')
				{
					console.log("weather geo");
					console.log("lat = "+lat+" long = "+long);
					GetWeatherByCoord(id,lat,long);
				}
				else if(intent=="weather")
				{
					console.log("btngan");
					SendResponse(id,"I can see you are asking about the weather but i cannot find the city can you recheck the spelling ?");
				}
				else if(intent=="clothes")
		    	{
		    		console.log("clothes");
		    		console.log("obj city = ",obj['city']);
		    		GetWeatherByCityName(id,obj['city'],function(temp,desc,id){
		    			var last="";
		    			if(temp>=1&&temp<=300)
		    			{
		    				last="1st";
		    			}
		    			else if(temp>=301&&temp<=500)
		    			{
		    				last="2nd";
		    			}
		    			console.log("last  = "+last);
  						SendResponse(id,last);
		    		});
		    	}

	    	}    		
    	}
    	else
    	{
    		if(intent=='city')
    		{
    			cn=par['geo-city'];
    			if(cn!='')
    			{
					DB.conn("users",'u',{id:id},{$set:{id:id,city:cn}},function(){});
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