function validatePhone(phone) {

    if (!phone) {
        return {
            valid: true,
            value: null
        };
    }

    const cleaned = phone.replace(/\s+/g, "");

    if (!/^\+?\d{7,15}$/.test(cleaned)) {
        return {
            valid: false,
            message: "❌ Invalid phone number."
        };
    }

    return {
        valid: true,
        value: cleaned
    };

}

module.exports = validatePhone;