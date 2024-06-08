const jwt = require('jsonwebtoken');
const config = require("../config/config");


const auth = (req, res, next) => {
  
  console.log(req.cookies);
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token,config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = auth;