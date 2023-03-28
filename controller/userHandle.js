const expreess = require("express");
const mongoose = require("mongoose");
const router = expreess.Router();
const userSchema = require("../schema/userSchema");
const User = new mongoose.model("user", userSchema);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// signup
router.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    username,
    password: hashPassword,
  });

  await newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User signup successfull" });
    })
    .catch((error) => {
      res.status(406).json({ error, error: "There was server side problem" });
    });
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          access_token: token,
          message: "Login successfull! ",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed! 1",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed! 2 ",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication failed! 3",
    });
  }
});

module.exports = router;
