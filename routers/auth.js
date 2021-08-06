const express = require('express');
const router = express.Router();

const {register,login,getUser,logout,imageUpload,forgotPassword,resetPassword,editDetails} = require('../contorllers/auth');
const {getAccessToRoute} = require('../middlewares/authorization/auth');
const profileİmage = require('../middlewares/libraries/profileİmageUpload')

router.post('/register',register);
router.post('/login',login);
router.get('/logout',getAccessToRoute,logout);
router.get('/profile',getAccessToRoute,getUser);
router.post("/forgotPassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editDetails);
router.post("/upload",[getAccessToRoute,profileİmage.single("profile_image")],imageUpload)



module.exports = router;