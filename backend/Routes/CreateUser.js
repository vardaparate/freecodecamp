const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = "MyLaptopIsHP14sSeriesModel";

router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password', 'short password').isLength({ min: 3 }),
],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }

            await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            });
            res.json({ success: true });
        }
        catch (error) {
            console.log(error);
            res.json({ success: false, message: "enter valid credentials" });
        }
    })

router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'short password').isLength({ min: 3 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "try logging with correct cred" });
            }

            const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
            if (!pwdCompare) {
                return res.status(400).json({ errors: "try logging with correct pass" });
            }

            const data = {
                user: {
                    id: userData._id
                }
            }
            const authToken = jwt.sign(data, jwtSecret, { expiresIn: '10m' });
            return res.json({ success: true, authToken: authToken });
        }
        catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })

module.exports = router; 