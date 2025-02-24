const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const query = require('../db/query');
const verifyCb = async (username, password, done) => {
  try {
    const rows = await query.getUserByUsername(username);
    const user = rows[0];

    if (!user) {
      console.log('wrong username');
      return done(null, false, { message: 'Incorrect username' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // passwords do not match!
      return done(null, false, { message: 'Incorrect password' });
    }

    //success
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
const localStrategy = new LocalStrategy(verifyCb);

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});
