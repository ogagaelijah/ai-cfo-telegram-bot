function validateAmount(amount) {

    const value = Number(amount);

    if (isNaN(value)) {
        return {
            valid: false,
            message: "❌ Please enter a valid number."
        };
    }

    if (value <= 0) {
        return {
            valid: false,
            message: "❌ Amount must be greater than zero."
        };
    }

    return {
        valid: true,
        value
    };

}

module.exports = validateAmount;