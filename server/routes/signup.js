const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/userController");


router.post("/signup", usercontroller.createUser, (req, res) => {
    return res.json('Success: created');
});

module.exports = router;