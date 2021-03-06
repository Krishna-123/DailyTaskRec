var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
   res.write('hello node js in heroku');
   console.log('Get request received ');
   res.status(200);
   res.end();
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://Krishna123:vkrishna123@ds157624.mlab.com:57624/storedailytask";
var dateFormat = require('dateformat');
var now;

var mqtt = require('mqtt')
var client  = mqtt.connect('tcp://iot.eclipse.org:1883')


var Mess = "";
var Result = [{}];


var mess = '';
// mqtt implementation
console.log("Main Server is starting...");

client.on('connect', function () {
  client.subscribe('M@Message')
});
 
client.on('connect', function () {
  client.subscribe('C@Data')
 });
 
client.on('message', function (topic, message) {
  // message is Buffer
   now = new Date();
   var todayDate  = dateFormat(now, "isoDate");
   console.log(message.toString());
  // check from which side publish is done.

 if (topic.toString() === "M@Message" ) { 
     mess = message.toString();
       //console.log(now);
      // insert into the database
      MongoClient.connect(url, function(err, db) {
   if (err) throw err;
      
      // var Timefield = dateFormat(now, "shortTime");
      var myobj = { Date: todayDate, Message: mess };
      db.collection("DailyTask").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("documents inserted");
        db.close();
       });
      });
  }else if (topic.toString() === "C@Data") {
    var i = 0;
    var query = { Date: todayDate };
     MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("DailyTask").find(query, { _id: false }).toArray( function(err, res) {
      if (err) throw err;
       
      i++;
      Result = res;

        // console.log("value of " + i);
         if (i===1) {
          console.log(res)
          SendToComputer(todayDate);
          };
         
         db.close();
        });
    }); 
  }
});

function SendToComputer(todayDate){
   if (Result.length == 0) {
     client.publish('C@Server', todayDate+"_\nthis time we have nothing") ;
   }else{
    for (var i = 0; i <Result.length; i++) {
     Mess = todayDate + "_\n{ "+ (Result[i].Message)+ " }" +"\n\n"
     client.publish('C@Server', Mess) ;
     } 
   }   
     console.log("publish done");
 }  //To connect using the mongo shell: 

var server = app.listen(port,function () {
  console.log("Example app listening ")
});

// /*MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   db.createCollection("DailyTask", function(err, res){
//     if (err) throw err;

//     console.log("Collection DailyTask created!");
//     db.close();
//   });
  
// });
// */

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//  db.collection("DailyTask").drop(function(err, delOK) {
//     if (err) throw err;
//     if (delOK) console.log("Collection deleted");
//     db.close();
//   });
// }); 


//  /* var i = 1;
//   db.collection("DailyTask").count(function(err, count){
//     console.log("total number of records are  "+ count );
//     totalRecord = count;
//   });*/