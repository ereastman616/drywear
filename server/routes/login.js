const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.verifyUser, userController.startSession, userController.setSSIDCookie, (req, res) => {
    return res.json();
});


module.exports = router;