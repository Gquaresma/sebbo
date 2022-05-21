import pkg from "jsonwebtoken";
import { jwt_key } from "../../env.js";
import prisma from "../config/db.js";

const { verify, decode } = pkg;

export default (req, res, next) => {
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
  const authId = decode(token, jwt_key).userId;

  if (userId !== authId) {
    return res.status(403).json({
      auth: false,
      message: "Access denied",
    });
  }

  verify(token, jwt_key, async (err, payload) => {
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
