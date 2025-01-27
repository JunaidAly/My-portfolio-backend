const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const newUser = new User({ name, email, message });
  await newUser.save();
  res.status(201).json({ message: 'Message sent successfully!' });
});

module.exports = router;