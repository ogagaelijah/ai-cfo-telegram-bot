function validateEmail(email) {

    if (!email) {
        return {
            valid: true,
            value: null
        };
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
        return {
            valid: false,
            message: "❌ Invalid email address."
        };
    }

    return {
        valid: true,
        value: email.trim()
    };

}

module.exports = validateEmail;