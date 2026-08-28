const Department = require('../models/Department');
const Programme = require('../models/Programme');
const Block = require('../models/Block');
const Room = require('../models/Room');
const Role = require('../models/Role');
const User = require('../models/User');

const getModel = (type) => {
    switch (type) {
        case 'departments': return Department;
        case 'programmes': return Programme;
        case 'blocks': return Block;
        case 'rooms': return Room;
        case 'roles': return Role;
        case 'users': return User;
        default: return null;
    }
};

const getPopulateFields = (type) => {
    switch (type) {
        case 'programmes': return ['department'];
        case 'blocks': return ['department', 'programme'];
        case 'rooms': return ['block', 'department', 'programme'];
        case 'users': return ['role', 'department', 'programme'];
        default: return [];
    }
};

// @desc    Get all items of a master type
// @route   GET /api/master/:type
// @access  Private/Admin
const getItems = async (req, res) => {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid master type' });

    try {
        let query = Model.find({});
        const populateFields = getPopulateFields(req.params.type);
        populateFields.forEach(field => {
            query = query.populate(field);
        });

        const items = await query.exec();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new item to master data
// @route   POST /api/master/:type
// @access  Private/Admin
const addItem = async (req, res) => {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid master type' });

    try {
        const item = new Model(req.body);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an item from master data
// @route   DELETE /api/master/:type/:id
// @access  Private/Admin
const deleteItem = async (req, res) => {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid master type' });

    try {
        const item = await Model.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an item in master data
// @route   PUT /api/master/:type/:id
// @access  Private/Admin
const editItem = async (req, res) => {
    const Model = getModel(req.params.type);
    if (!Model) return res.status(404).json({ message: 'Invalid master type' });

    try {
        let item = await Model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        Object.assign(item, req.body);
        const updatedItem = await item.save();

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getItems, addItem, editItem, deleteItem };
