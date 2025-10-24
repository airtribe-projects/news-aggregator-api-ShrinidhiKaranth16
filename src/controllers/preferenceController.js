const User = require('../models/user');
const { validatePreferences } = require('../utils/validation');

const getPreferences = async (req, res) => {
    try {
        const { id } = req.user;
        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ preferences: foundUser.preferences });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { id } = req.user;
        const { preferences } = req.body;

        // Validate preferences
        const prefValidation = validatePreferences(preferences);
        if (!prefValidation.isValid) {
            return res.status(400).json({ message: prefValidation.error });
        }

        const foundUser = await User.findById(id);
        if (!foundUser) return res.status(404).json({ message: "User not found" });
        foundUser.preferences = preferences;
        await foundUser.save();
        res.status(200).json({ preferences: foundUser.preferences });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getPreferences, updatePreferences };
