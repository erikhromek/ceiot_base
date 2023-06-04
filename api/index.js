const express = require("express");
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
//const PgMem = require("pg-mem");
const pgp = require('pg-promise')(/* options */)
require('dotenv').config({path: './.env'});

const db = pgp('postgres://' + process.env.DB_USER + ':'+ process.env.DB_PASSWORD +'@' + process.env.DB_HOST +':' + process.env.DB_PORT + '/' + process.env.DB_NAME);

    const render = require("./render.js");
// Measurements database setup and access

let database = null;
const collectionName = "measurements";

async function startDatabase() {
    const uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";	
    const connection = await MongoClient.connect(uri, {useNewUrlParser: true});
    database = connection.db();
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

async function insertMeasurement(message) {
    const {insertedId} = await database.collection(collectionName).insertOne(message);
    return insertedId;
}

async function getMeasurements() {
    return await database.collection(collectionName).find({}).toArray();	
}

// API Server

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static('spa/static'));

const PORT = 8080;

app.post('/measurement', function (req, res) {
    console.log("device id    : " + req.body.id + " key         : " + req.body.key + " temperature : " + req.body.t + " humidity    : " + req.body.h);	
    const {insertedId} = insertMeasurement({key: req.body.key, id:req.body.id, t:req.body.t, h:req.body.h, datetime: new Date()});
	res.send("received measurement into " +  insertedId);
});

app.post('/measurement.json', function (req, res) {
    const data = req.body;
    console.log(data);
    db.any("select device_id from devices where device_id = $1 and key = $2", [data.id, data.key]).then(function(result) {
        console.log(result);
        if (result.length > 0) {
            const {insertedId} = insertMeasurement({key: data.key, id:data.id, t:data.t, h:data.h, datetime: new Date()});
            res.send("received json measurement into " +  insertedId);
        }
        else {
            res.status(403);
            res.send("No se encontró device_id con tal clave");
        }
    })
    .catch(function(error) {
        res.status(500);
        res.send("Error interno al buscar datos");
    });
});

app.post('/device', function (req, res) {
	console.log("device id    : " + req.body.id + " name        : " + req.body.n + " key         : " + req.body.k );

    db.none("INSERT INTO devices VALUES ('"+req.body.id+ "', '"+req.body.n+"', '"+req.body.k+"')");
	res.send("received new device");
});


app.get('/web/device', function (req, res) {
	db.many("SELECT * FROM devices").then(

        function(data){
	var devices = data;
	var result = "";
	for (let i=0; i< devices.length;i++) {
		result = result + '<tr><td><a href=/web/device/'+ devices[i].device_id +'>' + devices[i].device_id + "</a>" +
                           "</td><td>"+ devices[i].name+"</td><td>"+ devices[i].key+"</td></tr>";
	}
	res.send("<html>"+
                     "<head><title>Sensores</title></head>" +
                     "<body>" +
                        "<table border=\"1\">" +
                           "<tr><th>id</th><th>name</th><th>key</th></tr>" +
                           result +
                        "</table>" +
                     "</body>" +
                "</html>");
        }
    );
});

app.get('/web/device/:id', function (req,res) {
    var template = "<html>"+
                     "<head><title>Sensor {{name}}</title></head>" +
                     "<body>" +
		        "<h1>{{ name }}</h1>"+
		        "id  : {{ id }}<br/>" +
		        "Key : {{ key }}" +
                     "</body>" +
                "</html>";
    var device = db.many("SELECT * FROM devices WHERE device_id = '"+req.params.id+"'").then(
	function(device) {
            res.send(render(template,{id:device[0].device_id, key: device[0].key, name:device[0].name}));
	});
});	


app.get('/term/device/:id', function (req, res) {
    var red = "\33[31m";
    var green = "\33[32m";
    var blue = "\33[33m";
    var reset = "\33[0m";
    var template = "Device name " + red   + "   {{name}}" + reset + "\n" +
		   "       id   " + green + "       {{ id }} " + reset +"\n" +
	           "       key  " + blue  + "  {{ key }}" + reset +"\n";
    db.many("SELECT * FROM devices WHERE device_id = '"+req.params.id+"'").then(
        function(device){
            res.send(render(template,{id:device[0].device_id, key: device[0].key, name:device[0].name}));
        }
    );
});

app.get('/measurement', async (req,res) => {
    res.send(await getMeasurements());
});

app.get('/device', function(req,res) {
	db.many("select * from devices").then(function(data){
		res.send(data);
	});
});

startDatabase().then(async() => {
    await insertMeasurement({id:'00', t:'18', h:'78', datetime: new Date(), key: "example"});
    await insertMeasurement({id:'00', t:'19', h:'77', datetime: new Date(), key: "example"});
    await insertMeasurement({id:'00', t:'17', h:'77', datetime: new Date(), key: "example"});
    await insertMeasurement({id:'01', t:'17', h:'77', datetime: new Date(), key: "example"});
    console.log("mongo measurement database Up");

    db.many("SELECT 1;").then(function(data){
        console.log("sql device database up");
    });


    app.listen(PORT, () => {
        console.log(`Listening at ${PORT}`);
    });
});
