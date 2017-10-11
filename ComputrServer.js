var fs = require('fs');
var mqtt = require('mqtt');
var dateFormat = require('dateformat');
var client  = mqtt.connect('tcp://iot.eclipse.org:1883')
/*var now = new Date();*/
/*= dateFormat(now, "isoUtcDateTime")*/
// var mess;
var dMess;
var FirstMess=0;
console.log("computer requesting for daily records");

client.on('connect', function () {
  client.subscribe('C@Server')
  client.publish('C@Data', 'Hello Server this is computer')
});
 
client.on('message', function (topic, message) {
   	if (topic.toString() === "C@Server") {
   	mess = message.toString();
  	separateMess(mess);
  }
 });

function separateMess(FMess){
  dMess = FMess.split("_");
   FirstMess++; 
   if (FirstMess === 1) {
    console.log("filename is: " + dMess[0]); 
   fs.writeFile(dMess[0], dMess[0]+"\nHello V.krishnaAgarwal\nHere is your Today Messages Thank You for using us!!\n\n");
   };
   WriteFile(dMess[0], dMess[1]);
  
}

function WriteFile(filename, mess){
  fs.appendFile(filename,  mess , function (err) {
   if (err) throw err;
   console.log('It\'s saved! in same location.');
   });  
    client.end(); // Close the connection when published
  }
 


  