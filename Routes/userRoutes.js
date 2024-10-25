const express = require('express');
const router = express.Router();
const userController=require("../controllers/userController")
const verifyToken = require("../middlewares/verifyToken")

router.route('/')
    .get( verifyToken , userController.getAllusers)
    .patch(verifyToken, userController.updateProfile);

router.route('/register')
    .post( userController.register)

router.route('/login')
    .post( userController.login)    
module.exports = router