const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/passport');
const { isAuth, isAdmin } = require('./authMiddleware');

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success',
  }),
  (req, res, next) => {}
);

router.post('/register', async (req, res, next) => {
  // hash password
  console.log('req body:', req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // store the user
  await pool.query(
    'insert into users (username,password,isAdmin) values($1, $2, $3)',
    [req.body.username, hashedPassword, req.body.isAdmin]
  );
  res.redirect('/');
});

/**
 * -------------- GET ROUTES ----------------
 */



// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
  const form = `
    <h1>Register Page</h1>
    <form method="post" action="register">
        <label for="username">Enter Username:</label><br>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">Enter Password:</label><br>
        <input type="password" id="password" name="password" required>
        <br>
        <label for="isAdmin">Is Admin:</label>
        <input type="checkbox" id="isAdmin" name="isAdmin">
        <br><br>
        <input type="submit" value="Submit">
    </form>
`;

  res.send(form);
});

/**
   -----------------PROTECTED-ROUTES-----------------------------
 */
router.get('/protected-route', isAuth, (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  res.send(
    '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

router.get('/super-protected-route', isAdmin, (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
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
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

module.exports = router;
