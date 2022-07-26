const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
//update user

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(401).send(error.message);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updted");
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(403).send("you can update only your account");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(403).send("you can delete only your account");
  }
});

//get a user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).send("user has been followed");
      } else {
        res.status(403).send("you already follow this user");
      }
    } catch (error) {
      return res.status(200).send(error);
    }
  } else {
    res.status(403).json("you cant follow yourslef");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).send("user has been unfollowed");
      } else {
        res.status(403).send("you didn't follow this user");
      }
    } catch (error) {
      return res.status(200).send(error);
    }
  } else {
    res.status(403).json("you cant unfollow yourslef");
  }
});

module.exports = router;
