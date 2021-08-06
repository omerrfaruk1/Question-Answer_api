const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenhelpers")
const {validateUserInput,compairePassword} = require("../helpers/input/inputHelpers")
const sendEmail = require("../helpers/libraries/sendEmail")
    const register = asyncErrorWrapper(async (req,res,next) => {
            // POST data
            const {name,email,password,role} = req.body;   
            const user = await User.create({
                name,
                email,
                password,
                role
            });
            sendJwtToClient(user,res);
    });

    const login = asyncErrorWrapper(async (req,res,next) => {
        const {email,password} = req.body;

        if(!validateUserInput(email,password)){
            return next(new CustomError("Please check your input"));
        }
        const userEmaill = await User.findOne({email})
        if(userEmaill === null){
            return next(new CustomError("Please use a valid email",400))
        }
        
        const user = await User.findOne({email}).select("+password")
        
       
        if(!compairePassword(password,user.password)){
            return next(new CustomError("Please check your credentials"));
        }
        
        sendJwtToClient(user,res);

        
        
    });

    const logout = asyncErrorWrapper(async (req,res,next) => {

        const {NODE_ENV} = process.env;

        return res
        .status(200)
        .cookie({
            httpOnly : true,
            expires : new Date(Date.now()),
            secure : NODE_ENV === 'development' ? false : true
        }).json({
            success : true,
            message : "Logout succesfull"
        });

    })

    const getUser = (req,res,next) => {
        res.json({
            success: true,
            data: {
                id : req.user.id,
                name : req.user.name
            }
        })
    };

    const imageUpload  = asyncErrorWrapper(async (req,res,next) => {
        
        const user = await User.findByIdAndUpdate(req.user.id,{
            "profile_image" : req.savedProfileİmage
        }
        ,{
            new : true,
            runValidators : true
        }
        )
        res.status(200).json({
            success: true,
            message : "Image Upload Successfully",
            data : user
        })
        
    });
    const forgotPassword = asyncErrorWrapper(async (req,res,next) => {

        const resetEmail = req.body.email;

        const user = await User.findOne({email : resetEmail});

        if(!user) {
            return next(new CustomError("There is no user with that email",400));
        }
        const resetPasswordToken = user.getResetPasswordTokenFromUser();

        await user.save();

        const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

        const emailTemplate = `
            <h3> Reset Your Password </h3>
            <p> this <a href= '${resetPasswordUrl}' target = '_blank'>link</a> Will expire in 1 hour</p>
        `;
        try{
            await sendEmail({
                from : process.env.SMTP_USER,
                to : resetEmail,
                subject: "Reset Your Password",
                html: emailTemplate
            });
            return res.status(200).json({
            success: true,
            messasge: "token sent to your email"
        });
        }catch{
            user.resetPasswordToken = undefined;
            user.resetPasswordExprie = undefined;
    
            await user.save();
    
            return next (new CustomError("Email Colud Not Be Sent",500))
        }
    });
    const resetPassword  = asyncErrorWrapper(async (req,res,next) => { 
        
        const {resetPasswordToken} = req.query; 

        const {password} = req.body;

        if(!resetPasswordToken){
            return next(new CustomError("Please provide a valid token",400))
        };

        let user = await User.findOne({
            resetPasswordToken : resetPasswordToken,
            resetPasswordExprie : {$gt : Date.now()}
        });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExprie = undefined;

        await user.save();
        
        return res
        .status(200).json({
            success: true,
            messasge: "put request is success"
        })
    });
    const editDetails = asyncErrorWrapper(async (req,res,next) => {
        const editInformations = req.body;

        const user = await User.findByIdAndUpdate(req.user.id,editInformations,{
            new: true,
            runValidators: true
        });

        return res.status(200)
        .json({
            success: true,
            data: user
        })
    })
    

    

module.exports = {
    register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails

}