const express = require('express');
const router = express.Router();

const menuController = require("../controllers/menuController")
const {validationSchema} = require('../middlewares/ValidationSchema')
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');

router.route('/')
    .get( menuController.getAllMenu)
    .post(
     verifyToken,
     allowedTo(userRoles.ADMIN),
     validationSchema(),
     menuController.createItem)


router.route('/:menuId')
    .get(menuController.getSingleItem)
    .patch(verifyToken , allowedTo(userRoles.ADMIN),menuController.updateMenu)
    .delete(verifyToken , allowedTo(userRoles.ADMIN),menuController.deleteMenu)


module.exports = router