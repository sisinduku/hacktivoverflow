const express = require('express');
const router = express.Router();

const QuestionCtrl = require('../controllers/QuestionCtrl');

router.get('/get_questions/:user?', QuestionCtrl.getQuestions);
router.get('/get_question/:slug', QuestionCtrl.getQuestionBySlug);

module.exports = router;
