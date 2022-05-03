const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwt_key } = require("../../env");
const saltRounds = 10;

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      const check = await prisma.users.count({
        where: {
          email,
        },
      });

      console.log(check);

      if (check === 0) {
        console.log("jashdl");
        bcrypt.hash(password, saltRounds, async (err, passwordHash) => {
          if (err) {
            res.status(500).json(error.message);
          }

          const user = await prisma.users.create({
            data: {
              name,
              email,
              phone,
              password: passwordHash,
            },
          });

          const token = jwt.sign({ userID: user.id }, jwt_key);

          return res.status(201).json({ token });
        });
      } else {
        return res.status(500).json({ message: "Email already exist" });
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(422)
          .json({ error: "Must provide email and password" });
      }

      const user = await prisma.users.count({
        where: {
          email,
        },
      });

      if (user === 0) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const data = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (!data) {
        return res.status(422).json({ error: "Invalid password or email" });
      }

      await bcrypt.compare(password, data.password);

      const token = jwt.sign({ userId: data.id }, jwt_key);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
