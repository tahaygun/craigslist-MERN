const bodyparser = require( 'body-parser');
const expressValidator = require('express-validator');
const User = require('../models/User');
const Listing = require('../models/Listing');
var { check, validationResult } = require('express-validator/check');
const bcrypt = require("bcrypt");
function hashPassword (password) {
    return bcrypt.hashSync(password, 12);
}

module.exports= function(app) {
    function authenticateUser(req, res, next) {
        if(req.session.user) return next();
        res.json({error:true, message: "Not authenticated, please login!"});
    }

    const regValidation=[check('email')
        .not().isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email should be an email address'),
        check('firstname')
        .not().isEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('Name should be at least 2 letters')
        .matches(/^([A-z]|\s)+$/).withMessage('Name cannot have numbers'),
        check('lastname')
        .not().isEmpty().withMessage('Last name is required')
        .isLength({ min: 2 }).withMessage('Last name should be at least 2 letters'),
        check('password')
        .not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
        check('email').custom(value => {
            return User.findOne({ email: value })
            .then(function (user) {
                if (user) {
                throw new Error('This email is already in use');
                }
            })
        })
        ];

        function createUser(req, res) {
            const user = new User(req.body);
            var errors = validationResult(req);
            
            if (!errors.isEmpty()) {
                return res.send({ errors: errors.mapped() });
            }

                user.password = user.hashPassword(user.password);
                user.save()
                .then((user)=>{
                    return res.json({ok:true, message:"You are successfully registerated."})
                })
                .catch((error)=>{
                    return res.json({error:"Something went wrong, user is not registerated!", error});
                })
        }
    app.post('/api/register', regValidation, createUser );

    //Loging is Start
    
    const logValidation=[check('email')
    .not().isEmpty().withMessage('Email is required'),
    check('password')
    .not().isEmpty().withMessage('Password is required')
]
    function loginUser(req, res) {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ errors: errors.mapped() });
        }
        User.findOne({
            email: req.body.email,
        })
        .then(function (user) {
            if (!user) {
                return res.send({ error: true, message:"User does not exist!" })
            } 
            if (!(user.comparePassword(req.body.password, user.password))) {
                return res.send({error:true , message: "Wrong password!"})
            }
             req.session.user = user;
             req.session.isLoggedIn= true;
             return res.send({ message: 'You are signed in' });
            res.send(user);
        })
        .catch(function (error) {
            console.log(error);
        })
        
    }
    app.post("/api/login", logValidation, loginUser);

    //Current User Start
    app.get('/api/isloggedin', (req, res)=>{
        if(req.session.isLoggedIn) {
            res.send(true)
        }else{
            res.send(false)
        }
    })

    app.delete('/api/postdelete/:id',(req, res)=>{
        Listing.findOneAndRemove({_id:req.params.id})
        .then((res)=>{res.send(res)})
        .catch((err)=>{res.send(err)})
    })

    app.get('/api/current_user', function (req, res) {
        if (req.session.user) {
          User.findById(req.session.user._id,['email', 'firstname', 'lastname'])
            .then(function (user) {
              res.send(user)
            })
        } else {
          res.send({ error: true, message:"You are not logged in!" })
        }
      });
      //PostListing Starts
      const listingValidation=[check('title')
      .not().isEmpty().withMessage('Title is required')
      .isLength({ min: 3 }).withMessage('Title should be at least 3 letters'),
      check('description')
      .not().isEmpty().withMessage('Description is required')
      .isLength({ min: 2 }).withMessage('Description should be at least 20 letters'),
      check('location')
      .not().isEmpty().withMessage('Location name is required'),
      check('contact')
      .not().isEmpty().withMessage('Contact is required'),
      check('price')
      .not().isEmpty().withMessage('Price is required')
      .isNumeric().withMessage("Price should be a number!")
      ];
    function postListing(req, res) {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({ errors: errors.mapped() });
        }
        var listing = new Listing(req.body);
        listing.user = req.session.user._id;
        listing.save()
        .then((user)=>{res.json({success:true})})
        .catch((error)=>{res.json(error)});
    }
    app.post('/api/postlisting', listingValidation, authenticateUser, postListing);

    function showListings(req, res) {
        Listing.find()
        .populate('user',['firstname','email'])
        .then((listings)=>{res.json(listings)})
        .catch((error)=>{res.json(error)});
    }
    app.get('/api/showlistings', showListings)
    
    function showOneListing(req, res) {
        Listing.findById({_id:req.params.listingId})
        .populate('user',['firstname','email'])
        .then((listing)=>{res.json(listing)})
        .catch((error)=>{res.json(error)})
    }
    app.get('/api/showOne/:listingId', showOneListing);

    app.get('/api/logout', (req, res)=>{
        req.session.destroy();
        res.send({message: "Logged out!" });
    })

    app.post('/salak', (req, res)=>{res.send(req.body.name)})
}