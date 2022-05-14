const jwt = require("jsonwebtoken");
const { jwt_key } = require("../../env");
const prisma = require("../config/db");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // console.log(authorization);
  if (!authorization) {
    return res.status(401).json({
      auth: false,
      message: "You must be loged in",
    });
  }

  const token = authorization.replace("x-access-token ", "");

  jwt.verify(token, jwt_key, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        auth: false,
        message: "You must be loged in",
      });
    }

    console.log(payload);

    const { userID } = payload;

    const user = await prisma.users.findUnique({
      where: { id: userID },
    });

    req.user = user;
    next();
  });
};
