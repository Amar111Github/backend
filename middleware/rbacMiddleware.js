const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtKey = process.env.JWTKEY;

function verifyAdmin(req, res, next) {
  verifyRole(req, res, next, [1]);
}

function verifyAdminHR(req, res, next) {
  verifyRole(req, res, next, [1, 2]);
}

function verifyHR(req, res, next) {
  verifyRole(req, res, next, [2]);
}


function verifyHREmployee(req, res, next) {
  const roleChecks = (authData) => {
    if (authData.Account == 2) {
      return true;
    } else if (authData.Account == 3) {
      return authData._id == req.params.id;
    }
    return false;
  };
  verifyCustom(req, res, next, roleChecks);
}

function verifyEmployee(req, res, next) {
  const roleChecks = (authData) => {
    return authData.Account == 3 && authData._id == req.params.id;
  };
  verifyCustom(req, res, next, roleChecks);
}

function verifyManager(req, res, next) {
  verifyRole(req, res, next, [4]);
}

function verifyAdminHRManager(req, res, next) {
  verifyRole(req, res, next, [1, 2, 4]);
}

function verifyAdminHREmployee(req, res, next) {
  const roleChecks = (authData) => {
    return (
      authData.Account == 1 ||
      authData.Account == 2 ||
      (authData.Account == 3 && authData._id == req.params.id)
    );
  };
  verifyCustom(req, res, next, roleChecks);
}

function verifyAll(req, res, next) {
  verifyRole(req, res, next, [1, 2, 3, 4]);
}

function verifyRole(req, res, next, allowedRoles) {
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    jwt.verify(Header, jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (allowedRoles.includes(authData.Account)) {
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    res.sendStatus(403);
  }
}

function verifyCustom(req, res, next, roleChecks) {
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    jwt.verify(Header, jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (roleChecks(authData)) {
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    res.sendStatus(403);
  }
}

module.exports = {
  verifyAdmin,
  verifyAdminHR,
  verifyHR,
  verifyHREmployee,
  verifyEmployee,
  verifyManager,
  verifyAdminHRManager,
  verifyAdminHREmployee,
  verifyAll,
};
