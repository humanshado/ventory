const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.get('/login', usersController.getLoginForm);
router.post('/login', usersController.postLogin);
router.get('/signup', usersController.getCreateUserForm);
router.post('/signup', usersController.postCreateUser);
router.get('/logout', usersController.getLogOut);





module.exports = router;
