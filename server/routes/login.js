const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userController");

router.get("/", usercontroller.verifyUser, (req, res) => {
    return res.json();
});


module.exports = router;