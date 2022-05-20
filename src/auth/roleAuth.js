const jwt = require("jsonwebtoken");
const { jwt_key } = require("../../env");
const prisma = require("../config/db");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.replace("x-access-token ", "");

    jwt.verify(token, jwt_key, async (err, payload) => {
      if (err) {
        return res.status(401).json({
          auth: false,
          message: "You must be logged in",
        });
      }

      console.log(payload);
      const { userId } = payload;

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });

      console.log(user);

      if (user.role === "admin") {
        console.log("opaaaa");
        return next();
      }

      return res.status(401).json({ error: "Forbiden" });
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
