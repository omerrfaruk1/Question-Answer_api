const express = require('express');
const router = express.Router({mergeParams:true});

const {addNewAnswerToQuestion,getAllAnswersByQuestion,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,UnlikeAnswer} = require('../contorllers/answer') 
const {getAccessToRoute,getAnswerOwnerAccess} = require('../middlewares/authorization/auth');
const {checkQuestionAndAnwerExist} = require('../middlewares/database/databaseErrorHelepers');



router.post('/',getAccessToRoute,addNewAnswerToQuestion);
router.get("/",getAllAnswersByQuestion)
router.get("/:answer_id",checkQuestionAndAnwerExist,getSingleAnswer)
router.get("/:answer_id/like",[checkQuestionAndAnwerExist,getAccessToRoute],likeAnswer);
router.get("/:answer_id/unlike",[checkQuestionAndAnwerExist,getAccessToRoute],UnlikeAnswer);
router.put("/:answer_id/edit",[checkQuestionAndAnwerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer)
router.delete("/:answer_id/delete",[checkQuestionAndAnwerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer)


module.exports = router;