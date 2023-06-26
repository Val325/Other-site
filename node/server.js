const http = require('http');

const hostname = '127.0.0.1';
const port = 8000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');
const express = require("express");
const cors = require('cors')
const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.urlencoded());
app.use(express.json());
app.get('/', function(req, res) {
  let data_db = {};
  
   // Query data from the table
   let dataProm = new Promise((resolve, reject) => {
   db.each("SELECT id, datatext FROM TextTables", function(err, row) {
      console.log("Data from Database: ", row.id + ": " + row.datatext);

      data_db[row.id] = row.datatext;
      resolve(data_db); 
     });
  }).then(rows => {
      console.log(rows)
      res.status(200).send(rows); 
  })



})
app.post('/', function(request, response){
    console.log("From frontend: ", request.body.data.text);
    db.serialize(function() {
    // Create a table
    db.run("CREATE TABLE IF NOT EXISTS TextTables (id INTEGER PRIMARY KEY, datatext TEXT)");

    // Insert data into the table
    db.run("INSERT INTO TextTables (datatext) VALUES (?)", request.body.data.text);

    
   });
   //db.close(); 
})
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

