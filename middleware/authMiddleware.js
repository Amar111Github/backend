const jwt = require("jsonwebtoken");
// const jwtKey = 'your-secret-key'; // Replace with your actual secret key
require("dotenv").config();

function verifyAdmin(req, res, next) {
  console.log(req.headers["authorization"]);
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log(authData);
        if (authData.Account == 1) {
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

function verifyAdminHR(req, res, next) {
  console.log(req.headers["authorization"]);
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (
          authData.Account == 1 ||
          authData.Account == 2 ||
          authData.Account == 4
        ) {
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

function verifyAdminHREmployee(req, res, next) {
  console.log(req.headers["authorization"]);
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (
          authData.Account == 1 ||
          authData.Account == 2 ||
          authData.Account == 3
        ) {
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

function verifyHR(req, res, next) {
  const Header = req.headers["authorization"];
  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (authData.Account == 2) {
          console.log("hello------");
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
function verifyManager(req, res, next) {
  const Header = req.headers["authorization"];
  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (authData.Account == 4) {
          console.log("hello------");
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

function verifyHREmployee(req, res, next) {
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (authData.Account == 2) {
          next();
        } else if (authData.Account == 3) {
          if (authData._id == req.params.id) {
            next();
          } else {
            res.sendStatus(403);
          }
        } else if (authData.Account == 4) {
          if (authData._id == req.params.id) {
            next();
          } else {
            res.sendStatus(403);
          }
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

function verifyEmployee(req, res, next) {
  const Header = req.headers["authorization"];

  if (typeof Header !== "undefined") {
    // decodedData = jwt.decode(req.headers['authorization']);
    // if(decodedData.Account)
    jwt.verify(Header, process.env.jwtKey, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        if (authData._id == req.params.id) {
          if (authData.Account == 3) {
            next();
          } else {
            res.sendStatus(403);
          }
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
// Other middleware functions...

module.exports = {
  verifyAdmin,
  verifyAdminHR,
  verifyHR,
  verifyHREmployee,
  verifyEmployee,
  verifyManager,
  verifyAdminHREmployee
  // Export other middleware functions...
};
