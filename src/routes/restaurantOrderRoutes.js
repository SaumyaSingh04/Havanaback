const express = require('express');
const router = express.Router();
const restaurantOrderController = require('../controllers/restaurantOrderController');

// Create new order
router.post('/create', restaurantOrderController.createOrder);

// Get all orders
router.get('/all', restaurantOrderController.getAllOrders);

// Update order status
router.patch('/:id/status', restaurantOrderController.updateOrderStatus);

// Link existing orders to bookings
router.post('/link-to-bookings', restaurantOrderController.linkOrdersToBookings);

module.exports = router;