const express = require('express');
const router = express.Router();

const AnswerCtrl = require('../controllers/AnswerCtrl');

router.get('/get_answers/:user/:questionId', AnswerCtrl.getAnswerByQuestion);
router.get('/get_answer/:user/:answerId', AnswerCtrl.getAnswer);
router.put('/upvote/:answerId', AnswerCtrl.upvoteAnswer);
router.put('/downvote/:answerId', AnswerCtrl.downvoteAnswer);
router.put('/unvote/:answerId', AnswerCtrl.unvoteAnswer);
router.post('/post_answer/', AnswerCtrl.postAnswer);
router.post('/update_answer/:answerId', AnswerCtrl.updateAnswer);
router.delete('/delete_answer/:answerId', AnswerCtrl.deleteAnswer);

module.exports = router;
