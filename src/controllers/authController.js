const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { isValidEmail, isValidPassword, validatePreferences } = require('../utils/validation');
const signup = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length (minimum 6 characters)
    if (!isValidPassword(password, 6)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate preferences if provided
    if (preferences) {
      const prefValidation = validatePreferences(preferences);
      if (!prefValidation.isValid) {
        return res.status(400).json({ message: prefValidation.error });
      }
    }

    console.log(req.body);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, preferences });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id,email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signup, login };
