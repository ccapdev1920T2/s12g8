const express = require ('express');
const router = express.Router();
const userSignupController = require ('../controllers/userSignupController');
const userLoginController = require ('../controllers/userLoginController');
const adminRegController = require ('../controllers/adminRegController');

router.post('/signup', userSignupController.postSignUp);

router.post('/login', userLoginController.postLogin);

router.get('/:username', userSignupController.deleteUser);

router.post('/adminsignup', adminRegController.postSignUp);

module.exports = router;