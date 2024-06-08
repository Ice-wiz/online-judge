const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Ensure the correct path to your User model
const config=require('../config/config')

const signup = async (req, res) => {
  console.log("hi")
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: '1h' });

    // Set the cookie with the token
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Change to true if you're using HTTPS in production
      sameSite: 'strict',
    });

    console.log(res.cookie)

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  console.log("Login request received");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env !== 'development', // Use secure cookies in production
      sameSite: 'Lax',
      path: '/'
    });

    // Log the cookies being set
    console.log('Set-Cookie header:', res.getHeaders()['set-cookie']);

    res.status(201).json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const logout = (req, res) => {
  console.log("in logout");
  res.clearCookie('token');
  res.status(201).json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };
