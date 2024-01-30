const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const app = express();
const port = 3000;

// ---------- DB CONNECTION -----------------

const url = process.env.ATLAS_URI || "";
const client = new MongoClient(url);

let conn, db;
async function connectDb (){    
    try{ 
        conn = await client.connect();
        console.log("Ya conecto tu");
    } catch {
        console.error(e);
    }
    db = conn.db("MessDb");        
}
connectDb();
exports.db;

// ------------- APP CONFIG --------------

//hoisting - process that js does after scanning the code so the variables ara available all the time
//js works on a nonblockable ... so next allows js to keep working
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

//-------- ROUTES -----------//

app.get("/", async (req, res) =>{
    let collection = await db.collection("MessCollection");
    let results = await collection.find({}).toArray();
    res.send(results);
});

app.post("/", async (req, res) =>{
    let newDocument = req.body;
    console.log(newDocument);    
    let result = await db.collection("MessCollection").insertOne(newDocument);
    res.send(result).status(204);
});

app.patch("/:id", async (req, res) =>{
    const query = { _id: new ObjectId(req.params.id)};
    const updates = {
        $set: { "class": "Furro el grande" }
    };
    let collection = await db.collection("MessCollection");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
});

app.delete("/:id", async (req, res) =>{
    const query = { _id: new ObjectId(req.params.id)};
    const collection = db.collection("MessCollection");
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
});

// -------- Console confirmation ------

app.listen(port, function(){
    console.log("Ahueso ya jala en el puerto:", port);
});
