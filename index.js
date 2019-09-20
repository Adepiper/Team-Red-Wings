const express = require('express')
 const router = express.Router()
 const {ensureAuthenticated} = require('./config/auth')

 router.get('/' , (req, res)=> res.render('Welcome'));
 router.get('/dashboard' , ensureAuthenticated, (req, res)=> 
 res.render('dashboard',  {
     name: req.user.firstName
 }));


 module.exports = router;