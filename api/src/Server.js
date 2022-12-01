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
        let courseArray = await db.collection("courses").find().sort("name",1).toArray();
        let json = { "technologies": techArray, "courses": courseArray };

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

app.post("/post/:collectionIdentifier/:id", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect(); 
        console.log(request.params);
        console.log(request.params.collectionIdentifier);

         // sanitize objectID of document to update from route parameter
         let id = (request.params.id !== 'null')? new ObjectId(request.sanitize(request.params.id)) : null;

        //collection identifier to identify the collection
        let collectionIdentifier = request.sanitize(request.params.collectionIdentifier);

        if(collectionIdentifier === "technologies"){
            // sanitize form input
            request.body.name = request.sanitize(request.body.name);
            request.body.description = request.sanitize(request.body.description);
            request.body.difficulty = request.sanitize(request.body.difficulty);
            request.body.courses.forEach(course => {
                if(course._id) delete course['_id'];
                course.code = request.sanitize(course.code);
                course.name = request.sanitize(course.name);
            });
        }else if(collectionIdentifier === "courses"){
            // sanitize form input
            request.body.code = request.sanitize(request.body.code);
            request.body.name = request.sanitize(request.body.name);
        }      

        let result = "";

        //if id is there, update. else insert
        if(id){
            let selector = { "_id": id };
            let newValues = { $set: request.body };    
            console.log(">>>>>>>>>>new val: ", newValues);    
            result = await mongoClient.db(DB_NAME).collection(collectionIdentifier).updateOne(selector, newValues);
        }
        else{
            // insert new document into DB
            result = await mongoClient.db(DB_NAME).collection(collectionIdentifier).insertOne(request.body);
        }      

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


app.delete("/delete/:collectionIdentifier", async (request, response) => {
    // construct MongoClient object for working with MongoDB
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    
    //collection identifier to identify the collection
    let collectionIdentifier = request.sanitize(request.params.collectionIdentifier);

    // Use connect method to connect to the server
    try {
        await mongoClient.connect();
        // get reference to desired collection in DB
        let collectionObj = mongoClient.db(DB_NAME).collection(collectionIdentifier);

        let id = new ObjectId(request.sanitize(request.body._id));
        
        let selector = { "_id": id };
        let result = await collectionObj.deleteOne(selector); 
        // status code for created
        if (result.deletedCount <= 0) {
            response.status(404);
            response.send({error: 'No documents found with ID'});
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