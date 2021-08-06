const express = require('express');
const question = require('./question');
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const answer = require("./answer");


// api
const router = express.Router();

router.use("/question",question);
router.use("/auth",auth);
router.use("/user",user);
router.use("/admin",admin);
router.use("/answer",answer);



module.exports = router;