import prisma from "../config/db.js";
import { decode } from "jsonwebtoken";
import { jwt_key } from "../../env.js";

export async function getUser(jwtToken, res) {
  try {
    if (!jwtToken) {
      return res.status(422).json({ error: "Must provide a jwt token" });
    }

    const id = decode(jwtToken, jwt_key).userId;

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
}
