const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')

const db = require('./config/keys').MongoURI

mongoose.connect (db, {useNewUrlParser: true})
.then(() => console.log('MongoDb connected...'))
.catch(err => console.log(err))

app.use(expressLayouts);
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extented: false}))

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(flash());

  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  })

app.use('/public', express.static('public'));

app.use('/', require('./routes/index'))

app.use('/users', require('./routes/user'))
 const PORT = process.env.PORT || 5000;



 app.listen(PORT, console.log(`Server started on port ${PORT}`))
 