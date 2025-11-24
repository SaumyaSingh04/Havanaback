const mongoose = require('mongoose');
const Room = require('./src/models/Room.js');
const Category = require('./src/models/Category.js');

async function fixRoomCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://as4316664:p14oakjZAwNVViwi@cluster2.bpvo94u.mongodb.net/havanabackend?retryWrites=true&w=majority&appName=Cluster2');
    console.log('Connected to MongoDB');

    // Get all categories
    const categories = await Category.find({});
    console.log('Available categories:', categories.map(c => ({ id: c._id, name: c.name })));

    // Find SUPER PREMIUM DELUXE category
    const superPremiumCategory = categories.find(c => c.name.includes('SUPER PREMIUM'));
    
    if (superPremiumCategory) {
      // Update room 206 to SUPER PREMIUM DELUXE category
      const result = await Room.updateOne(
        { room_number: '206' },
        { categoryId: superPremiumCategory._id }
      );
      console.log('Updated room 206 category:', result);
    } else {
      console.log('SUPER PREMIUM DELUXE category not found');
    }

    // Show current room assignments
    const rooms = await Room.find({}).populate('categoryId');
    console.log('Current room assignments:');
    rooms.forEach(room => {
      console.log(`Room ${room.room_number}: ${room.categoryId?.name || 'No category'} (Price: ₹${room.price})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixRoomCategories();