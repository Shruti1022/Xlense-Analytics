const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/UserModel');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const makeAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set. Ensure backend/.env has MONGO_URI and JWT_SECRET');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const userEmail = process.argv[2] || process.env.ADMIN_EMAIL;
    if (!userEmail) {
      throw new Error('No email provided. Usage: node scripts/makeAdmin.js user@example.com');
    }

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { role: 'Admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`User ${userEmail} is now an admin`);
    } else {
      console.log(`User ${userEmail} not found`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();