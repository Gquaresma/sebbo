const prisma = require("../config/db");
const jwt = require("jsonwebtoken");
const { jwt_key } = require("../../env");

module.exports = {
  getUser: async (jwtToken, res) => {
    try {
      if (!jwtToken) {
        return res.status(422).json({ error: "Must provide a jwt token" });
      }

      const id = jwt.decode(jwtToken, jwt_key).userID;

      if (!id) {
        return res.status(422).json({ error: "Invalid token" });
      }

      const user = await prisma.users.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return user;
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
