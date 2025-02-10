require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const { pool } = require('./db/pool');
require('./passportJs/index');
const pgSession = require('connect-pg-simple')(session);

//---------------Configuration-----------------------------
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//-------------- PASSPORT AUTHENTICATION ----------------
app.use(
  session({
    store: new pgSession({
      pool: pool, // Connection pool
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    // Insert express-session options here
  })
);

app.use(passport.authenticate('session'));

//------------------- global app.use(middlewares)---------

app.use((req, res, next) => {
  console.log(req.session);
  console.log('req.user:', req.user);
  next();
});

//------------------------------- Routes-------------------
app.use(routes);

// ---------------------server---------------------------
app.listen(3000);
