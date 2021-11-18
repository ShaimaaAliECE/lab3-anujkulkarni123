//requires external modules
const express = require('express');
const path = require('path');
const mySql = require('mysql');
const { Router } = require('express');

//app variables
const app = express();
const port = 80;
const route = express.Router();

let conn = mySql.createConnection({
    host: '35.238.3.171', 
    user: 'root',
    password: '3316',
    database: 'Lab3',
});

//initializing app
app.set("view engine", "ejs")
app.use(express.static('Views'));
app.use('/', route);
app.get('/', (req, res) => {
    //conn.connect();
  
    res.render('UserLogin');
 
    //keep last
    //conn.end();
})

//rendering eaxh page

route.get("/adminView", (req,res) => {
    res.render('DoogleAdmin')
})

route.get("/guestView", (req,res) => {
    res.render('DoogleGuest')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



