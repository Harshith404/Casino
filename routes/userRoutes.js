const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    loginUser,
    registerUser,
    deposit,
    withdraw,
    coinFlip,
    getUser,
    leaderboard
} = require("../controllers/userController");

router.post("/deposit",auth,deposit)
router.post("/withdraw",auth,withdraw);
router.get("/leaderboard",leaderboard);
router.post("/coinflip",auth,coinFlip);
router.post("/register", registerUser);
router.post("/login",loginUser);
router.post("/user",auth,getUser);

module.exports = router;