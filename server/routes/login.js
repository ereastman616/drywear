const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/", userController.verifyUser, userController.startSession, userController.setSSIDCookie, (req, res) => {
    return res.status(200).json("verified");
});


module.exports = router;