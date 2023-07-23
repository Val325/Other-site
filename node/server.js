const http = require('http');
const express = require("express");
const cors = require('cors')
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

const hostname = '127.0.0.1';
const port = 8000;
app.use(cookieParser());
const timeCookie = 1000 * 60 * 60 * 24 * 60;
//app.use(cookieParser());

app.use(session({
    secret: "6661edd990d17ce27223c326d6bb3e18",
    name: 'user',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Set httpOnly to false to allow access from client-side scripts
        // Other cookie options like maxAge, secure, etc. can be set here as well.
        secure: false,
        maxAge: timeCookie,
    }
}))

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.db');

const multer  = require('multer')
//const cookie = require('js-cookie')
//const upload = multer({ dest: 'uploads/' })
// /home/projects/forumNodeJs/react/forum/src
//const prefixLoad = "/home/projects/forumNodeJs/react/forum/src"
const prefixLoad = "../react/forum/src"
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(cors({
    origin: 'http://localhost:3000', // Set the origin to allow requests from the frontend
    credentials: true, // Included credentials as true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let isAuth = {};
var hour = 3600000 * 24;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    /* 
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    */
    //req.session.user = isAuth; 
    next();
});




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

function isAuthentification(auth, path){
    if (auth){
        console.log("-----------------");
        console.log("Auth ", path);
        console.log("-----------------");
    }else{
        console.log("-----------------");
        console.log("Not auth! ", path);
        console.log("-----------------");
    }
}
function filterAllSessions(sessionsArray){
    let userData;

    for (let key in sessionsArray) {
        //console.log("key: ",key, "value: ",sessionsArray[key]);
        //console.log("user: ",JSON.parse(sessionsArray[key]));
 
        if (JSON.parse(sessionsArray[key])["user"]){
            console.log("user in login: ",JSON.parse(sessionsArray[key]))
            return JSON.parse(sessionsArray[key])
        } 
    }
}

app.get('/api/posts', function(request, response) {
    //request.session.destroy();
   //console.log("session: ", request.sessionStore.sessions);
    filterAllSessions(request.sessionStore.sessions) 
    let data_db = {};
   //isAuthentification(isAuth, "/api/posts") 
   // Query data from the table
   let dataProm = new Promise((resolve, reject) => {
   db.each("SELECT id, datatext, imageurl FROM TextTables", function(err, row) {
      //console.log("Data from Database: ", row.id + ": " + row.datatext);
      //console.log("All data from DB: ", row)
      data_db[row.id] = {id: row.id, text: row.datatext, url_image: row.imageurl};
      resolve(data_db); 
     });
  }).then(rows => {
      console.log(rows)
      response.status(200).send(rows); 
  })
})

app.get('/api/posts/:postId', function(request, response) {

    let data_db = [];
    //console.log("session: ", request.session.user);

    //isAuthentification(isAuth, "/api/posts")
   // Query data from the table
   let dataProm = new Promise((resolve, reject) => {
   db.each("SELECT id, numPost, datatext, imageurl FROM Subposts WHERE numPost = ?", request.params["postId"], function(err, row) {
      
      
      //console.log("Data from Database: ", row.id + ": " + row.datatext + ": " + row.numPost);
      //console.log("All data from DB: ", row)
      data_db[row.id] = {id: row.id, id_post: row.numPost, text: row.datatext, url_image: row.imageurl};
      resolve(data_db); 
     });
  }).then(rows => {
      console.log("Promise: ", rows)
      response.status(200).send(rows); 
  })



})
app.post('/',upload.single('image'), function(request, response){

    console.log("From frontend: ", request.body.text);
    console.log("Image from frontend: ", request.file, request.body);
    //console.log("session: ", request.session);
    //console.log("cookie: ", request.cookies)
    isAuthentification(isAuth, "/api/posts")
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


app.post('/post/:postId',upload.single('image'), function(request, response){

    console.log("From frontend: ", request.body.text);
    console.log("Image from frontend: ", request.file, request.body);
    console.log("ID: ", request.params["postId"])
    console.log("session: ", request.session.user);
    isAuthentification(isAuth, "/api/posts")
    if (request.file === undefined){
       db.serialize(function() {
       // Create a table
       db.run("CREATE TABLE IF NOT EXISTS Subposts (id INTEGER PRIMARY KEY, numPost INTEGER, datatext TEXT, imageurl TEXT)");

       // Insert text and image into the table
       db.run("INSERT INTO Subposts (numPost, datatext, imageurl) VALUES (?,?,?)",request.params["postId"] ,request.body.text, null);
       });
    }else {
       console.log("Path: ", request.file.path);
       
       db.serialize(function() {
       // Create a table
       db.run("CREATE TABLE IF NOT EXISTS Subposts (id INTEGER PRIMARY KEY, numPost INTEGER, datatext TEXT, imageurl TEXT)");

       // Insert text and image into the table
       db.run("INSERT INTO Subposts (numPost, datatext, imageurl) VALUES (?,?,?)",request.params["postId"],request.body.text, request.file.filename);
       });

    }

    
    

   //db.close(); 
})

app.post('/registration',function(request, response){

    console.log("Registration: ", request.body);
    console.log("----------------------");
    console.log("login: ", request.body.login);
    console.log("password: ", request.body.Password);
    console.log("session: ", request.session.user);
    console.log("----------------------");
    isAuthentification(isAuth, "/api/posts")
    db.serialize(function() {
       // Create a table
       db.run("CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, login TEXT, password TEXT)");
       bcrypt.hash(request.body.Password, saltRounds, function(err, hash) {
            // Insert text and image into the table
            db.run("INSERT INTO Users (login, password) VALUES (?,?)", request.body.login, hash);
            //request.session.user = { name:request.body.login };
            //request.session.save();
       })
    });
})


app.post('/login',async function(request, response){
    //request.session.destroy(); 
    console.log("Login: ", request.body);
    console.log("----------------------");
    console.log("login: ", request.body.login);
    console.log("password: ", request.body.Password);
    //console.log("session user: ", request.session);
    console.log("----------------------");
    // Query data from the table
   /*
    db.each("SELECT id, login, password FROM Users WHERE login = ?", request.body.login, function(err, row) {
      
    console.log("Data: ", row);
    console.log("HashPass: ", row.password);
    console.log("PlainPass: ", request.body.Password);
   //console.log("Data from Database: ", row.id + ": " + row.login + ": " + row.Password);
    bcrypt.compare(request.body.Password, row.password, function(err, result) {
        if (result){
            console.log("You auth!");
            request.session.auth = true;
        }else{
            console.log("You not auth!");
            request.session.auth = false;
        }})
   })
*/
    let auth = false;

    // Запрос данных пользователя из базы данных
    const userData = await new Promise((resolve, reject) => {
        db.get("SELECT id, login, password FROM Users WHERE login = ?", request.body.login, function(err, row) {
            if (err) {
                reject(err);
            } else {123
                resolve(row);
            }
        });
    });

    if (userData) {
        // Сравнение паролей
        const passwordMatch = await bcrypt.compare(request.body.Password, userData.password);
        if (passwordMatch) {
            console.log("You auth!");
            
            request.session.user = { user: request.body.login };
            
        } else {
            console.log("You not auth!");
        }
    } else {
        console.log("User not found!");
    }


    console.log("session /login: ", request.session)
    //request.session.save();
    response.send(request.session) 
    //isAuth = request.session;
})
app.get("/login", function(request, response){ 
    response.json(filterAllSessions(request.sessionStore.sessions));
})

app.get("/delete-cookie", function(request, response){
   
   request.session.destroy();
   response.send("destroy session!");
})
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

