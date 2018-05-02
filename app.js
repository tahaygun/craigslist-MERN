const express = require( 'express');
const cors = require ('cors');
const mongoose = require( 'mongoose');
const bodyparser = require( 'body-parser');
const session= require('express-session');
const app = express();
const controller = require('./controller/controller');

app.use(bodyparser.json());

mongoose.connect("mongodb://root:root@ds155299.mlab.com:55299/loginreg");
app.use(session({
  secret: 'supersecretstring12345!',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: (60000*30) },
  // store: new MongoStore({ mongooseConnection: mongoose.connection }) //not neccesary
}))

app.use(cors({ //tis adds session to req, like so: req.session
  origin: ['http://localhost:3000'],
  methods: ['GET', 'HEAD','POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  credentials: true//allow setting of cookies
}));

controller(app);


app.listen(8000, ()=>{console.log('Listening...')})