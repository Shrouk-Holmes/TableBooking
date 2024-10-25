const { validationResult } = require('express-validator');
const Menu = require('../models/menuModel')
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError')

const getAllMenu = asyncWrapper(
    async (req, res) => {
    const query = req.query
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit
    const menu = await Menu.find({}, { "__v": false }).limit(limit).skip(skip)
    res.json({ status: httpStatusText.SUCCESS, data: { menu } });
})

const getSingleItem = asyncWrapper(
    async (req, res, next) => {

        const menu = await Menu.findById(req.params.menuId)
        if (!menu) {
            const error = AppError.create("item not found", 404, httpStatusText.FAIL)
            return next(error);
        }

        return res.json({ status: httpStatusText.SUCCESS, data: { menu } });

    }
)

const createItem = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = AppError.create(errors.array(), 400, httpStatusText.FAIL)
            return next(error);
        }


        const newItem = new Menu(req.body);

        await newItem.save();

        res.status(201).json({ status: httpStatusText.SUCCESS, data: { menu: newItem } });
    })

const updateMenu = asyncWrapper(
    async (req, res) => {
        const menuId = req.params.menuId;
        const updatedmenu = await Menu.findByIdAndUpdate(menuId, { $set: req.body }, { new: true });
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { menu: updatedmenu } });

    });


const deleteMenu =asyncWrapper(

    async (req, res) => {
    await Menu.deleteOne({ _id: req.params.menuId })
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });

})



module.exports = {
    getAllMenu, getSingleItem, createItem, updateMenu, deleteMenu

}