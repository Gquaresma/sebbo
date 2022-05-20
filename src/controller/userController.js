const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwt_key } = require("../../env");
const userHelper = require("../helpers/userHelper");
const saltRounds = 10;

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;

      const check = await prisma.users.count({
        where: {
          email,
        },
      });

      console.log(check);

      if (check === 0) {
        bcrypt.hash(password, saltRounds, async (err, passwordHash) => {
          if (err) {
            res.status(500).json(err.message);
          }

          const user = await prisma.users.create({
            data: {
              name,
              email,
              phone,
              role,
              password: passwordHash,
            },
          });

          const token = jwt.sign({ userId: user.id }, jwt_key);

          return res.status(201).json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
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

      if (passwordCorrect) {
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

      const user = await userHelper.getUser(jwtToken, res);

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

  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, phone } = req.body;

      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      const updatedUser = await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          name: name || user.name,
          email: email || user.email,
          phone: phone || user.phone,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      await prisma.users.delete({
        where: {
          id: userId,
        },
      });

      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
