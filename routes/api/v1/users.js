const express = require('express');
const router = express.Router();

const user_api_controller = require('../../../controllers/api/v1/users_api');

router.post('/create', user_api_controller.create);

module.exports = router;