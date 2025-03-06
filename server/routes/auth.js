const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//imports user from model 
const User = require('../models/User');

//ONLY WCU EMAILS 
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.endsWith('wcupa.edu')) {
            return res.status(400).json({message: "You must use a WCU email. "});
        }
        //generate salt and hash the password for storage 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //new user
        const newUser = new User({ email, password: hashedPassword});
        //save user in database
        await newUser.save();
        res.status(201).json({message: "User confirmed."});
    }catch {
        res.status(500).json({ error: error.message});
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body;
        //find user
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid Credentials."});
        //comparing password and username
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials."});
        //create payload and say yes by using JWT key
        const payload = {id: user._id, email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
        //return token
        res.json({ token });
    }catch (error) {
        res.status(500).json({error: error.message});
    }
});
module.exports = router;