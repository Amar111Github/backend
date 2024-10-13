const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const Header = req.headers["authorization"];

    if (typeof Header !== "undefined") {
      jwt.verify(Header, process.env.jwtKey, (err, authData) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          // Check if the user's role is in the allowed roles
          if (allowedRoles.includes(authData.Account)) {
            next();
          } else {
            return res.sendStatus(403); // Forbidden
          }
        }
      });
    } else {
      return res.sendStatus(403); // Forbidden
    }
  };
};

module.exports = verifyRoles;
