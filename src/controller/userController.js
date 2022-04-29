const prisma = require("../config/db");
const bcrypt = require("bcrypt");

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

          return res.status(201).json(user);
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

      const match = await bcrypt.compare(password, data.password);

      if (match) {
        console.log("LOGOU");
        return res.status(200).json(data);
      }

      return res.status(401).json({ message: "Not authorized" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
