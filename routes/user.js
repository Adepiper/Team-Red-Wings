const express = require('express')
 const router = express.Router()
 const bcrypt = require('bcryptjs')
 const mongoose = require('mongoose')
 const passport = require('passport')

 const User = require('../models/user')

 router.get('/login' , (req, res)=> res.render('login'));

 router.get('/Register' , (req, res)=> res.render('register'));

 router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, password2 } = req.body
    let errors =[];

    if(!firstName || !lastName|| !email|| !password || ! password2){
        errors.push({ msg: 'please fill in all fields'})
    }

    if(password !== password2){
        errors.push({msg: 'Passwords do not match'})
    }
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            firstName,
            lastName,
            email,
            password,
            password2
        })
    } else{
        User.findOne({ email: email})
        .then(user => {
            if(user){
                errors.push({msg: 'Email is already registered'})
                res.render('register', {
                    errors,
                    firstName,
                    lastName,
                    email,
                    password,
                    password2
                })
                } else {
                        const newUser = new User({
                            firstName,
                            lastName,
                            email,
                            password
                        })
                       bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;

                            newUser.password = hash
                            newUser.save()
                            .then( user =>{
                                req.flash('success_msg', 'Welcome to Team Red Wings, Login for more info');
                                res.redirect('login')
                            })
                            .catch(err = console.log(err))
                       }))
                }
            
        })
    }
 })

 router.post('/login', (req, res, next) => {
     passport.authenticate('local', {
         successRedirect: '/dashboard',
         failureRedirect: '/users/login',
         failureFlash: true
     })(req, res, next)
 })

 router.get('/logout', (req, res) =>{
     req.logout()
     req.flash('success_msg', 'You are logged out')
     res.redirect('/users/login')
 })

 module.exports = router; 