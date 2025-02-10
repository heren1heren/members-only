module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: 'must be authorized to access this route' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isadmin === true) {
    // since req.user is populated from postgressql -> isAdmin field got lowercased to isadmin. is there a way to prevent this to happen
    //* using quoted identifiers is a straightforward solution
    next();
  } else {
    res.status(401).json({ msg: 'must be authorized to access this route' });
  }
};
