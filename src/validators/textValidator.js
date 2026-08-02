function validateText(text, field = "Value") {

    if (!text || text.trim() === "") {
        return {
            valid: false,
            message: `❌ ${field} cannot be empty.`
        };
    }

    return {
        valid: true,
        value: text.trim()
    };

}

module.exports = validateText;