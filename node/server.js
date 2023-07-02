const http = require('http');

const hostname = '127.0.0.1';
const port = 8000;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.db');
const express = require("express");
const cors = require('cors')
const app = express();
const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })
// /home/projects/forumNodeJs/react/forum/src
const prefixLoad = "/home/projects/forumNodeJs/react/forum/src"

app.use(cors({
    origin: '*'
}));

app.use(express.urlencoded());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, prefixLoad + '/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ".png"
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


app.get('/api/posts', function(req, res) {
  let data_db = {};
  
   // Query data from the table
   let dataProm = new Promise((resolve, reject) => {
   db.each("SELECT id, datatext, imageurl FROM TextTables", function(err, row) {
      console.log("Data from Database: ", row.id + ": " + row.datatext);
      console.log("All data from DB: ", row)
      data_db[row.id] = {id: row.id, text: row.datatext, url_image: row.imageurl};
      resolve(data_db); 
     });
  }).then(rows => {
      console.log(rows)
      res.status(200).send(rows); 
  })



})
app.post('/',upload.single('image'), function(request, response){
    console.log("From frontend: ", request.body.text);
    console.log("Image from frontend: ", request.file, request.body);


    if (request.file === undefined){
       db.serialize(function() {
       // Create a table
       db.run("CREATE TABLE IF NOT EXISTS TextTables (id INTEGER PRIMARY KEY, datatext TEXT, imageurl TEXT)");

       // Insert text and image into the table
       db.run("INSERT INTO TextTables (datatext, imageurl) VALUES (?,?)", request.body.text, null);
       });
    }else {
       console.log("Path: ", request.file.path);
       
       db.serialize(function() {
       // Create a table
       db.run("CREATE TABLE IF NOT EXISTS TextTables (id INTEGER PRIMARY KEY, datatext TEXT, imageurl TEXT)");

       // Insert text and image into the table
       db.run("INSERT INTO TextTables (datatext, imageurl) VALUES (?,?)", request.body.text, request.file.filename);
       });

    }

    
    

   //db.close(); 
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

