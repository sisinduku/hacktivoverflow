const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/UserCtrl');

router.post('/get_authenticate', UserCtrl.getAuthenticate);

module.exports = router;
