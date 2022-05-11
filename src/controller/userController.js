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

          return res.status(201).json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
            },
          });
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

      const data = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }

      const passwordCorrect = await bcrypt.compare(password, data.password);

      if ( passwordCorrect ) {
        const token = jwt.sign({ userId: data.id }, jwt_key);
        return res.status(200).json({
          token,
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
        });
      }

      return res.status(422).json({ error: "Email ou senha inválidos" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  findOneByJwt: async (req, res) => {
    try {
      const { jwtToken } = req.body;

      if (!jwtToken) {
        return res.status(422).json({ error: "Must provide a jwt token" });
      }

      const id = jwt.decode(jwtToken, jwt_key).userId;

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

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
