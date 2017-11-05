const express = require('express');
const router = express.Router();

const QuestionCtrl = require('../controllers/QuestionCtrl');

router.post('/post_question/', QuestionCtrl.postQuestion);
router.get('/get_questions/:user?', QuestionCtrl.getQuestions);
router.get('/get_question/:slug', QuestionCtrl.getQuestionBySlug);
router.get('/upvote/:questionId', QuestionCtrl.upvoteQuestion);

module.exports = router;
