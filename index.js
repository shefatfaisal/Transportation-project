import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// const db = require('./db');
// import pg from "pg";
// db.js

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'flags',
    password: 'shefat',
    port: 5432,
});

db.connect();


const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


// Static start ID
const startId = 1; // Replace with your specific start location ID

// Function to get connections from a given location
async function getConnections(fromLocation) {
    console.log(`sdsd ${fromLocation}`);
    const res = await db.query(
        `SELECT c.start_location, c.end_location, l.name, c.fare 
         FROM connections c 
         JOIN locations l ON c.end_location = l.id 
         WHERE c.start_location = $1 
         ORDER BY c.fare ASC`, [fromLocation]);
    return res.rows;
}

// Function to get the location id by name
async function getLocationId(name) {
    const res = await db.query('SELECT id FROM locations WHERE name = $1', [name]);
    
    return res.rows.length ? res.rows[0].id : null;
}

// Pathfinding function to find the path to the destination
async function findPath(destinationName) {
    const destinationId = await getLocationId(destinationName);
    console.log(destinationId);
    console.log(destinationName);
    if (!destinationId) {
        console.log('Invalid destination name');
        return;
    }
    const paths = [];
    async function search(currentId, destinationId, currentPath) {
        if (currentId === destinationId) {
            paths.push([...currentPath, currentId]);
            return;
        }

        const connections = await getConnections(currentId);
        // console.log(connections[0]);
        for (let i = 0; i < connections.length; i++) {
            let end_location = (connections[i]["end_location"]);
            await search(end_location, destinationId, [...currentPath, currentId]);
        }
    }

    await search(destinationId, startId, []);
    console.log(paths);
    // return paths;
    
    db.end();
}


app.get("/", (req, res) => {
    res.render("index.ejs");
    // res.send("hsdsd");
});
app.get("/find", (req, res) => {
    res.render("findtransport.ejs");
    // res.send("hsdsd");
});
app.get("/transfer", (req, res) => {
    res.render("transferroutes.ejs");
    // res.send("hsdsd");
});
app.get("/about", (req, res) => {
    res.render("about.ejs");
    // res.send("hsdsd");
});
app.get("/search", (req, res) => {
    res.render("searchresult.ejs");
    // res.send("hsdsd");
});

app.post("/find", (req, res) => {
});
let a = {};
app.post("/submit", (req, res) => {
    const destinationLocation = req.body.destination; // Replace with your destination
    // findPath(destinationLocation);
    console.log(destinationLocation);
    findPath(destinationLocation);
    res.render("searchresult.ejs");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:{"port"}`);
});