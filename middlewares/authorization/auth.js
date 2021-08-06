const CustomError = require('../../helpers/error/CustomError');
const User = require('../../models/User');
const Question= require('../../models/Question');
const Answer = require('../../models/Answer');
const asyncErrorWrapper = require("express-async-handler")
const jwt = require('jsonwebtoken');
const {isTokenIncluded,getAccessTokenFromHeader} = require('../../helpers/authorization/tokenhelpers')


const getAccessToRoute = (req,res,next) => {
    
    if(!isTokenIncluded(req)){
        return next( 
        new CustomError("you are not authorized to access this route",401))
    }
    const access_token = getAccessTokenFromHeader(req);

    jwt.verify(access_token,process.env.JWT_SECRET_KEY,(err,decoded) => {

        if (err) {
            return next(new CustomError("you are not authorized to access this route",401))
        }
        req.user = {
            id : decoded.id,
            name : decoded.name
        };
        next();
    })
}
const getAdminAccess = asyncErrorWrapper(async(req, res,next) => {

    const {id} = req.user;

    const user = await User.findById(id);

    if(user.role !== "admin"){
        return next(new CustomError("Only admins can access this route",403))
    }
    
    return next();
});

const getQuestionOwnerAccess = asyncErrorWrapper(async(req, res,next) => {
    
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if(question.user != userId){
        return next(new CustomError("Only owner can handle this operation",403));   
    }
    return next();
});
const getAnswerOwnerAccess = asyncErrorWrapper(async(req, res,next) => {
    
    const userId = req.user.id;
    const answerId = req.params.answer_id;

    const answer = await Answer.findById(answerId);

    if(answer.user != userId){
        return next(new CustomError("Only owner can handle this operation",403));   
    }
    return next();
});




module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}