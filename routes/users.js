// Handling Routes

const express = require('express');
const router = express.Router();
const passport = require('passport');
const user_controller = require('../controllers/users_controller');
router.get('/signin', user_controller.signin);
router.get('/signup', user_controller.signup);
router.post('/create', user_controller.create);
router.post('/createsession', passport.authenticate(
    'local',
    { failureRedirect: '/users/signin' },
), user_controller.createsession);
module.exports = router;


router.post('/handlingapirequest', user_controller.handlingapirequest);

router.get('/signout', user_controller.destroysession);