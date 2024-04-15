const express = require('express');
const router = express.Router();
const {User} = require('./db');

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
console.log(user)
    if (user) {
      res.send({ status: 'success', username: user.username });
    } else {
      res.send('Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});
router.post('/api/register', async (req, res) => {
    const {email , username, password} = req.body;
    try{
        const user = await User.findOne({email , username, password});
        if(user){
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const newUser = new User({email , username, password});

await newUser.save();

  
    res.status(201).json({ status: 'success' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

module.exports = router;