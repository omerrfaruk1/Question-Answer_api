const express = require('express');
const router = express.Router();

const {getAccessToRoute,getAdminAccess} = require("../middlewares/authorization/auth");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelepers");
const {blockUser,deleteUser} = require("../contorllers/admin")

router.use([getAccessToRoute,getAdminAccess]);


router.get('/block/:id',checkUserExist,blockUser)
router.delete("/user/:id",checkUserExist,deleteUser);


module.exports = router;