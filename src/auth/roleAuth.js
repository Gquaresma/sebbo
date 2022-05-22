import pkg from "jsonwebtoken";
import { jwt_key } from "../../env.js";
import prisma from "../config/db.js";

const { verify, decode } = pkg;

export default (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.replace("x-access-token ", "");

    verify(token, jwt_key, async (err, payload) => {
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
