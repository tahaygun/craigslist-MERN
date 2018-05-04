const express = require( 'express');
const cors = require ('cors');
const mongoose = require( 'mongoose');
const bodyparser = require( 'body-parser');
const session= require('express-session');
const app = express();
const controller = require('./controller/controller');

var http = require("http");
setInterval(function() {
    http.get("https://infinite-sea-90747.herokuapp.com");
    console.log('okay');
}, 300000);

app.use(bodyparser.json());

mongoose.connect(//YOUR DATABASE CONNECTION);
app.use(session({
  secret: 'supersecretstring12345!',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: (60000*30) },
  // store: new MongoStore({ mongooseConnection: mongoose.connection }) //not neccesary
}))

app.use(cors({ //tis adds session to req, like so: req.session
  origin: ['http://localhost:3000', 'https://craigslist-t.firebaseapp.com'],
  methods: ['GET', 'HEAD','POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true//allow setting of cookies
}));

controller(app);


app.listen( process.env.PORT || 8000, ()=>{console.log('Listening...')})
