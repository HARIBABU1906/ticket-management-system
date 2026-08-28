const express = require('express');
const { getItems, addItem, editItem, deleteItem } = require('../controllers/masterController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.get('/:type', getItems);

// Apply admin check to mutations
router.use(admin);

router.post('/:type', addItem);
router.put('/:type/:id', editItem);
router.delete('/:type/:id', deleteItem);

module.exports = router;
