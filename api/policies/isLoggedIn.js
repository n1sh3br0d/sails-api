const jwt = require('jsonwebtoken');

module.exports = async(req, res, proceed) => {

  if (!req.headers.authorization) {
    return res.json(401, 'token required');
  }

  token = req.headers.authorization.split(' ');
  await jwt.verify(token[1], sails.config.custom.secretKey,(error, decode) => {
    if (error) {
      error.name === 'TokenExpiredError' ? res.json(401,'Token expired, please relogin') : res.json(401, 'invalid token');
    }
    if (decode) {
      req.id = decode.id;
      return proceed();
    }
  });

};
