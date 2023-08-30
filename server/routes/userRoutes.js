const {
  setAvatar,
  register,
  login,
  getAllUsers,
  searchUser,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/search/:query/:id", searchUser);

module.exports = router;
