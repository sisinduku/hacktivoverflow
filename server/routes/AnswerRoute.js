const express = require('express');
const router = express.Router();

const AnswerCtrl = require('../controllers/AnswerCtrl');

router.get('/get_answers/:user/:questionId', AnswerCtrl.getAnswerByQuestion);
router.post('/post_answer/', AnswerCtrl.postAnswer);

module.exports = router;
