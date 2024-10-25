const express = require('express');
const router = express.Router();
const tableController = require("../controllers/tableController");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require('../middlewares/allowedTo');
const userRoles = require('../utils/userRoles');

router.route('/')
    .get(
        verifyToken,
        allowedTo(userRoles.ADMIN, userRoles.USER),
        tableController.getMyBookings
    )
    .post(
        verifyToken,
        allowedTo(userRoles.ADMIN, userRoles.USER),
        tableController.createBooking
    );

router.route('/:bookingId')
    .patch(
        verifyToken,
        allowedTo(userRoles.ADMIN),
        tableController.updateBookingStatus
    );

module.exports = router;