const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
    loginUser,
    registerUser,
    deposit,
    withdraw,
    coinFlip,
    getMe,
    leaderboard,
    getTransactions,
    getAllUsers,
    getAdminStats
} = require("../controllers/userController");

router.post("/deposit",auth,deposit);
router.post("/withdraw",auth,withdraw);
router.get("/leaderboard",leaderboard);
router.post("/coinflip",auth,coinFlip);
router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/me",auth,getMe);
router.get("/transactions",auth,getTransactions);
router.get(
    "/admin/users",
    auth,
    admin,
    getAllUsers
);
router.get(
    "/admin/stats",
    auth,
    admin,
    getAdminStats
);
module.exports = router;