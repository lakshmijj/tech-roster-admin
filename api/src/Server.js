let express = require("express");
let cors = require('cors');
let path = require('path');
let MongoClient = require("mongodb").MongoClient;
let sanitizer = require('express-sanitizer');
let ObjectId = require('mongodb').ObjectId;

// MongoDB constants
const URL = "mongodb://mongo:27017/";
const DB_NAME = "dbTechs";

// construct application object via express
let app = express();
// add cors as middleware to handle CORs errors while developing
app.use(cors());

// middleware to read incoming JSON with request
app.use(express.json());
// middleware to sanitize all incoming JSON data
app.use(sanitizer());

// get absolute path to /build folder (production build of react web app)
const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build");
// adding middleware to define static files location
app.use("/", express.static(CLIENT_BUILD_PATH));

app.get("/get", async (request, response) => {    
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect();
        // get reference to database via name
        let db = mongoClient.db(DB_NAME);
        let techArray = await db.collection("technologies").find().sort("difficulty",1).toArray();
        let json = { "technologies": techArray };

        // set RESTFul status codes
        response.status(200);

        // serializes sampleJSON to string format
        response.send(json);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.post("/post", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect(); 

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.description = request.sanitize(request.body.description);
        request.body.difficulty = request.sanitize(request.body.difficulty);
        request.body.courses.forEach(course => {
            course.code = request.sanitize(course.code);
            course.name = request.sanitize(course.name);
        });

        // insert new document into DB
        let result = await mongoClient.db(DB_NAME).collection("technologies").insertOne(request.body);

        // status code for created
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.put("/put/:id", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect(); 

        // sanitize objectID of document to update from route parameter
        let id = new ObjectId(request.sanitize(request.params.id));

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.description = request.sanitize(request.body.description);
        request.body.difficulty = request.sanitize(request.body.difficulty);
        request.body.courses.forEach(course => {
            course.code = request.sanitize(course.code);
            course.name = request.sanitize(course.name);
        });

        // update document
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");
        let selector = { "_id": id };
        let newValues = { $set: request.body };
        let result = await techCollection.updateOne(selector, newValues);

        // check if document was updated correctly
        if (result.matchedCount <= 0) {
            response.status(404);
            response.send({error: 'No technology documents found with ID'});
            mongoClient.close();
            return;
        }
        
        // status code for document updated
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.delete("/delete/:id", async (request, response) => {
    // construct MongoClient object for working with MongoDB
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect();
        // get reference to desired collection in DB
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");
        // isolate route parameter
        let id = new ObjectId(request.sanitize(request.params.id));
        
        let selector = { "_id": id };
        let result = await techCollection.deleteOne(selector); 
        // status code for created
        if (result.deletedCount <= 0) {
            response.status(404);
            response.send({error: 'No technology documents found with ID'});
            return;
        }
        response.status(200);
        response.send(result);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

// wildcard to handle all other non-api URL routings (/selected, /all, /random, /search)
app.use("/*", express.static(CLIENT_BUILD_PATH));

// startup the Express server - listening on port 80
app.listen(80, () => console.log("Listening on port 80"));