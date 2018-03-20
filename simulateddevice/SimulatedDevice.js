'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString = "HostName=RealitXHub.azure-devices.net;SharedAccessKeyName=iothubowner;DeviceId=1qga06j;SharedAccessKey=V7wYbYbg4EQgRQau2t+sbaPOPgoDTpLMccbt+y6gUaI=";
var client = clientFromConnectionString(connectionString);

function printResultFor(op)
{
    return function printResult(err, res) 
    {
        if (err) 
        {
            console.log(op + ' error : ' + err.toString());
        }
        if (res) 
        {
            console.log(op + ' status : ' + res.constructor.name);
        }
    };
}

function randomDate(start, end, startHour, endHour)
{
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    
    date.setHours(hour);
    
    return date;
}

function generateData()
{
    var produitsList = ["Fruits/Légumes", "Produit laitier", "Alcool", "Viande", "Poisson", "Gâteau", "Hygiène", "Vêtements"];
    var startDate = new Date();
    var endDate = new Date().setMonth(new Date().getMonth() + 1);
    
    return {
        type : produitsList[Math.floor(Math.random() * 10 % produitsList.length)],
        date : randomDate(startDate, endDate, 0, 23),
        price : (Math.random() * 100 % 20)
    }
}

var connectCallback = function (err) 
{
    if (err) 
    {
        console.log("Could not connect : " + err);
    } 
    else 
    {
        console.log("Client connected.");
    }

    setInterval(function () 
    {
        var message = new Message(JSON.stringify(generateData()));
        client.sendEvent(message, printResultFor('send'));
    }, 500);
};

client.open(connectCallback);