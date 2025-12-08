const Laundry = require('../models/Laundry');
const LaundryItem = require('../models/LaundryItem');

exports.createLaundryOrder = async (req, res) => {
  try {
    const { orderType, bookingId, roomNumber, items } = req.body;
    
    // Basic validation - bookingId is more important than roomNumber
    if (!orderType || (!bookingId && !roomNumber) || !items || items.length === 0) {
      return res.status(400).json({ error: 'Order type, booking ID (or room number), and items are required' });
    }
    
    const laundry = new Laundry(req.body);
    await laundry.save();
    res.status(201).json({ success: true, laundry });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllLaundryOrders = async (req, res) => {
  try {
    const orders = await Laundry.find()
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaundryOrderById = async (req, res) => {
  try {
    const order = await Laundry.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLaundryOrder = async (req, res) => {
  try {
    const order = await Laundry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLaundryStatus = async (req, res) => {
  try {
    const { laundryStatus } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'picked_up', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(laundryStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const updateData = { laundryStatus };
    
    // Auto-set timestamps based on status
    if (laundryStatus === 'picked_up') {
      updateData.pickupTime = new Date();
    } else if (laundryStatus === 'delivered') {
      updateData.deliveredTime = new Date();
    }
    
    const order = await Laundry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLaundryOrder = async (req, res) => {
  try {
    const order = await Laundry.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaundryByRoom = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const orders = await Laundry.find({ roomNumber })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaundryByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Laundry.find({ laundryStatus: status })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by vendor
exports.getLaundryByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Laundry.find({ vendorId })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by booking ID
exports.getLaundryByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const orders = await Laundry.find({ bookingId })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by date range
// exports.getLaundryByDateRange = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const query = {};
    
//     if (startDate && endDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }
    
//     const orders = await Laundry.find(query)
//       .sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get laundry statistics
// exports.getLaundryStats = async (req, res) => {
//   try {
//     const totalOrders = await Laundry.countDocuments();
//     const pendingOrders = await Laundry.countDocuments({ laundryStatus: 'pending' });
//     const pickedUpOrders = await Laundry.countDocuments({ laundryStatus: 'picked_up' });
//     const readyOrders = await Laundry.countDocuments({ laundryStatus: 'ready' });
//     const deliveredOrders = await Laundry.countDocuments({ laundryStatus: 'delivered' });
    
//     const totalRevenue = await Laundry.aggregate([
//       { $group: { _id: null, total: { $sum: '$totalAmount' } } }
//     ]);
    
//     res.json({ 
//       success: true, 
//       stats: {
//         totalOrders,
//         pendingOrders,
//         pickedUpOrders,
//         readyOrders,
//         deliveredOrders,
//         totalRevenue: totalRevenue[0]?.total || 0
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Search orders
// exports.searchLaundryOrders = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ error: 'Search query is required' });
//     }
    
//     const orders = await Laundry.find({
//       $or: [
//         { roomNumber: { $regex: query, $options: 'i' } },
//         { requestedByName: { $regex: query, $options: 'i' } },
//         { grcNo: { $regex: query, $options: 'i' } }
//       ]
//     }).sort({ createdAt: -1 });
    
//     res.json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
