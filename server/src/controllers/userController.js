import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import axios from 'axios';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                profilePicture: user.profilePicture,
                occupation: user.occupation,
                hobby: user.hobby,
                phoneNumber: user.phoneNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, middleName, lastName, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            middleName: middleName || '',
            lastName: lastName || '',
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                profilePicture: user.profilePicture,
                occupation: user.occupation,
                hobby: user.hobby,
                phoneNumber: user.phoneNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.middleName = req.body.middleName !== undefined ? req.body.middleName : user.middleName;
            user.lastName = req.body.lastName !== undefined ? req.body.lastName : user.lastName;
            user.email = req.body.email || user.email;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;
            user.occupation = req.body.occupation !== undefined ? req.body.occupation : user.occupation;
            user.hobby = req.body.hobby !== undefined ? req.body.hobby : user.hobby;
            user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                middleName: updatedUser.middleName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                address: updatedUser.address,
                profilePicture: updatedUser.profilePicture,
                occupation: updatedUser.occupation,
                hobby: updatedUser.hobby,
                phoneNumber: updatedUser.phoneNumber,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user with Google
// @route   POST /api/users/google
// @access  Public
export const authGoogle = async (req, res, next) => {
    try {
        const { token } = req.body;

        // Fetch user data from Google
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { name, email, picture, given_name, family_name } = response.data;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in
            res.json({
                _id: user._id,
                name: user.name,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                profilePicture: user.profilePicture,
                occupation: user.occupation,
                hobby: user.hobby,
                phoneNumber: user.phoneNumber,
                token: generateToken(user._id),
            });
        } else {
            // User does not exist, create them
            // Passwords are required by Schema, generate a random one
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

            user = await User.create({
                name: name,
                middleName: '',
                lastName: family_name || '',
                email: email,
                password: randomPassword,
                profilePicture: picture || ''
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    middleName: user.middleName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    address: user.address,
                    profilePicture: user.profilePicture,
                    occupation: user.occupation,
                    hobby: user.hobby,
                    phoneNumber: user.phoneNumber,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400);
                throw new Error('Invalid user data received from Google');
            }
        }
    } catch (error) {
        // If the token is invalid or fetching fails
        console.error(error);
        res.status(401);
        next(new Error('Google authentication failed'));
    }
};
