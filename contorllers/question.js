const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler");

const askNewQuestions  = asyncErrorWrapper(async (req,res,next) => {

    const information = req.body;

    const questions = await Question.create({
        ...information, // veaya bu sekilde de verebnilirsin title : information.title content : information.content
        user: req.user.id
    });

    res.status(200).json({
        success: true,
        data: questions
    })
});
const getAllQuestions  = asyncErrorWrapper(async (req,res,next) => {
    return res.status(200).json(res.queryResult)
})
const getSingleQuestions = asyncErrorWrapper(async (req,res,next) => {

    return res.status(200).json(res.queryResult)
});
const editQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params

    const {title,content} = req.body;

    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();

    return res.status(200).json({
        success: true,
        data: question
    })
});
const deleteQuestion = asyncErrorWrapper(async (req,res,next) => {

    const {id} = req.params;

    await Question.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Questions delete operation succesfull"
    })
});
const LikeQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    if(question.likes.includes(req.user.id)){
        return next ( new CustomError("You already liked this Question",400))
    }
    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;

    await question.save();

    return res.status(200).json({
        success: true,
        data: question
    });
});
const UnLikeQuestion = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;

    const question = await Question.findById(id);

    if(!question.likes.includes(req.user.id)){
        return next ( new CustomError("You already does not liked this Question",400))
    }
    const index = question.likes.indexOf(req.user.id);
    
    question.likes.splice(index, 1);
    question.likeCount = question.likes.length;


    await question.save();

    return res.status(200).json({
        success: true,
        data: question
    });
});
module.exports = {
    askNewQuestions,
    getAllQuestions,
    getSingleQuestions,
    editQuestion,
    deleteQuestion,
    LikeQuestion,
    UnLikeQuestion

}
