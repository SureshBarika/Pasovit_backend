// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getOrdersForUser, getOrderById } = require('../controllers/orderController');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrdersForUser);
router.get('/:id', getOrderById);

module.exports = router;
