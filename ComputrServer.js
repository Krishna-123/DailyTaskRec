var fs = require('fs');
var mqtt = require('mqtt');
var dateFormat = require('dateformat');
var client  = mqtt.connect('tcp://iot.eclipse.org:1883')
var now = new Date();
var filename  = dateFormat(now, "isoDate");
var mess = "";
 
client.on('connect', function () {
  client.subscribe('C@Server')
  fs.writeFile(filename, filename+"\nHello V.krishnaAgarwal\nHere is your Today Messages Thank You for using us!!\n\n");
  client.publish('C@Data', 'Hello Server this is computer')
});
 
client.on('message', function (topic, message) {
   	if (topic.toString() === "C@Server") {
   	mess = message.toString();
  	WriteFile();
  }
 });

function WriteFile(){
  fs.appendFile(filename,  mess , function (err) {
   if (err) throw err;
   console.log('It\'s saved! in same location.');
   });  
    client.end(); // Close the connection when published
  }
 

 console.log(filename);
  