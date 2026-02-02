const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./../config/prisma');

exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, dob } = req.body;
    console.log(req.body);
    
    // Validate required fields
    if (!name || !email || !password || !mobileNumber || !dob) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user directly with Prisma (no Mongoose model needed)
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(), // Normalize email
        passwordHash,
        mobileNumber,
        dob: new Date(dob), // Convert string to Date object
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );
    
    // Send response (don't send password)
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        dob: newUser.dob,
        isAdmin: newUser.isAdmin,
        totalRewardCoins: newUser.totalRewardCoins,
        currentCarbonFootprint: newUser.currentCarbonFootprint,
      }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ 
      message: "Server Error",
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const existingUser = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });
    
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT (use 'id' not '_id' - Prisma uses 'id')
    const token = jwt.sign(
      {
        userId: existingUser.id, // Changed from _id to id
        isAdmin: existingUser.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );
    
    // Send response (never send password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser.id, // Changed from _id to id
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        totalRewardCoins: existingUser.totalRewardCoins,
        currentCarbonFootprint: existingUser.currentCarbonFootprint,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ 
      message: "Server Error",
      error: error.message 
    });
  }
};