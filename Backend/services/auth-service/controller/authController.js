const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./../config/prisma');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordExpire,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Try to send email, but don't fail properly if it breaks (dev mode)
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const message = {
        from: '"EcoHub Support" <support@ecohub.com>',
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please click the link to reset your password: ${resetUrl}`,
        html: `<p>You requested a password reset</p><p>Click this link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      };

      const info = await transporter.sendMail(message);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (emailErr) {
      console.error("Email sending failed (ignored for dev):", emailErr);
    }

    console.log(`Reset Password URL: ${resetUrl}`);

    res.status(200).json({
      success: true,
      data: 'Email sent',
      devMessage: 'Check backend terminal or UI for link',
      resetUrl,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    res.status(200).json({ success: true, data: 'Password updated' });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};