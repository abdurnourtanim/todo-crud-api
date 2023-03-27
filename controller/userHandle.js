const expreess = require("express");
const mongoose = require("mongoose");
const router = expreess.Router();
const userSchema = require("../schema/userSchema");
const User = new mongoose.model("user", userSchema);
const bcrypt = require("bcrypt");

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

module.exports = router;
