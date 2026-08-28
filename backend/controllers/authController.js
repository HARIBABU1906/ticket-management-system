const User = require('../models/User');
const Role = require('../models/Role');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Should be protected in production for SuperAdmin only)
const registerUser = async (req, res) => {
    const { name, email, password, phone, roleName, department, programme } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
        return res.status(400).json({ message: 'Role not found' });
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role._id,
        department,
        programme
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: role.name,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

module.exports = { authUser, registerUser };
