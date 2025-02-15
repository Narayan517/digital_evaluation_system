const adminModel = require('../models/adminModel');
const adminServer = require('../services/adminServer');
const { validationResult } = require('express-validator');

module.exports.registerAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const isAdminAlready = await adminModel.findOne({ email });

    if (isAdminAlready) {
        return res.status(400).json({ message: 'Admin already exist' });
    }

    const hashedPassword = await adminModel.hashPassword(password);

    const admin = await adminServer.createAdmin({
        name,
        email,
        password: hashedPassword
    });

    const token = admin.generateAuthToken();

    res.status(201).json({ token, admin });


}

module.exports.loginAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email }).select('+password');

    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = admin.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, admin });
}

module.exports.getAdminProfile = async (req, res, next) => {

    res.status(200).json(req.admin);

}