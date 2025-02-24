const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { isAuth, isAdmin } = require('./authMiddleware');
const query = require('../db/query');

const { password } = require('pg/lib/defaults');
/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success',
  })
);

router.post(
  '/sign-up',
  body('username').custom(async (value) => {
    const rows = await query.getUserByUsername(value);
    console.log(rows.length);
    if (rows.length > 0) {
      throw new Error('E-mail already in use');
    }
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        firstName,
        lastName,
        username,
        password,
        confirmedPassword,
        isAdmin,
      } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const membership_code = isAdmin ? 2 : 1;

      if (!(confirmedPassword === password)) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      await query.insertUser(
        firstName,
        lastName,
        username,
        hashedPassword,
        membership_code
      );
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.render('index');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
  res.render('login-page');
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up-page');
});

/**
   -----------------PROTECTED-ROUTES-----------------------------
 */
router.get('/protected-route', isAuth, (req, res, next) => {
  res.send(
    '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

router.get('/super-protected-route', isAdmin, (req, res, next) => {
  res.send(
    '<h1>You are an Admin!!!!</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});
// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
  res.send(
    '<p>You successfully logged in. -->   <a href="/protected-route">create messages </a></p>'
  );
});
router.get('/create-message', (req, res, next) => {
  res.send(
    '<p>You successfully logged in. -->   <a href="/protected-route">create messages </a></p>'
  );
});
router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong username or password.');
});

module.exports = router;
