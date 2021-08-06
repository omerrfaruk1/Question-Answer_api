const express = require('express');
const router = express.Router();
const Question = require('../models/Question')
const answer = require('./answer')
const {askNewQuestions,getAllQuestions,getSingleQuestions,editQuestion,deleteQuestion,LikeQuestion,UnLikeQuestion} = require('../contorllers/question');
const {getAccessToRoute,getQuestionOwnerAccess} = require('../middlewares/authorization/auth')
const {checkQuestionExist} = require('../middlewares/database/databaseErrorHelepers')
const questionQueryMiddlewqres = require('../middlewares/query/questionQueryMiddlewqres')
const answerQueryMiddlewares = require('../middlewares/query/answerQueryMiddlewares')



router.get("/:id/like",[getAccessToRoute,checkQuestionExist],LikeQuestion);
router.get("/:id/Ulike",[getAccessToRoute,checkQuestionExist],UnLikeQuestion);
router.get("/",questionQueryMiddlewqres(Question,{
    population : {
        path : "user",
        select : "name profile_image"
    }
}),getAllQuestions);
router.get("/:id",checkQuestionExist,answerQueryMiddlewares(Question,{
    population : [
        {
            path : "user",
            select : "name profile_image"
        },
        {
            path : "answers",
            select : "content"
        }
    ]
}),getSingleQuestions);
router.post("/ask",getAccessToRoute,askNewQuestions);
router.put("/:id/edit",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);
router.delete("/:id/delete",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);
router.use("/:question_id/answers",checkQuestionExist,answer);



module.exports = router;