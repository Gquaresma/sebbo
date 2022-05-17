const jwt = require("jsonwebtoken");
const { jwt_key } = require("../../env");
const prisma = require("../config/db");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // console.log(authorization);
  if (!authorization) {
    return res.status(401).json({
      auth: false,
      message: "You must be logged in",
    });
  }

  const token = authorization.replace("x-access-token ", "");
  
  const { userId } = req.params;
  const authId = jwt.decode(token, jwt_key).userId;

  if ( userId !== authId ) {
    return res.status(403).json({
      auth: false,
      message: "Access denied",
    });
  }

  jwt.verify(token, jwt_key, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        auth: false,
        message: "You must be logged in",
      });
    }

    const { userId } = payload;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    req.user = user;
    next();
  });
};
