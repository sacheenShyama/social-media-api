const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//RETGISTER
router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error.massage);
  }
});

//login

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).send("passsword not found");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.massage);
  }
});

module.exports = router;
