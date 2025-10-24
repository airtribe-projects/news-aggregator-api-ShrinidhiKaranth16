const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


const isValidPassword = (password, minLength = 6) => {
    return password && password.length >= minLength;
};


const validatePreferences = (preferences) => {
    if (!preferences) {
        return { isValid: false, error: 'Preferences are required' };
    }

    if (!Array.isArray(preferences)) {
        return { isValid: false, error: 'Preferences must be an array' };
    }

    for (let i = 0; i < preferences.length; i++) {
        if (typeof preferences[i] !== 'string' || preferences[i].trim() === '') {
            return { isValid: false, error: 'Each preference must be a non-empty string' };
        }
    }

    return { isValid: true };
};

module.exports = {
    isValidEmail,
    isValidPassword,
    validatePreferences
};
