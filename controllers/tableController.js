const { validationResult } = require('express-validator');
const Table = require('../models/tableModel');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');


const getMyBookings = asyncWrapper(
    async (req, res) => {
        const bookings = await Table.find({ user: req.currentUser.id, status: { $in: ['rejected', 'accepted'] } }, { "__v": false });

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { bookings }
        });
    }
);


const createBooking = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = AppError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }
        if (!req.currentUser || !req.currentUser.id) {
            const error = AppError.create("User information is missing from the request", 400, httpStatusText.FAIL);
            return next(error);
        }

        const newBooking = new Table({
            ...req.body,
            user: req.currentUser.id  
        });

        await newBooking.save();

        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: { booking: newBooking }
        });
    }
);


const updateBookingStatus = asyncWrapper(
    async (req, res, next) => {
        const bookingId = req.params.bookingId;
        const updatedBooking = await Table.findByIdAndUpdate(
            bookingId,
            { status: req.body.status },
            { new: true }
        );

        if (!updatedBooking) {
            return next(AppError.create("Booking not found", 404, httpStatusText.FAIL));
        }

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { booking: updatedBooking }
        });
    }
);

module.exports = {
    createBooking,
    getMyBookings,
    updateBookingStatus
};
