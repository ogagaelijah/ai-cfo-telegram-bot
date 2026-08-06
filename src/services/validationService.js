// ==========================
// NUMBER VALIDATION
// ==========================
function requirePositiveNumber(value, field) {

    const number = Number(value);

    if (Number.isNaN(number)) {
        throw new Error(`${field} must be a number.`);
    }

    if (number < 0) {
        throw new Error(`${field} cannot be negative.`);
    }

    return number;

}

// ==========================
// REQUIRED TEXT
// ==========================
function requireText(value, field) {

    if (!value || String(value).trim() === "") {
        throw new Error(`${field} is required.`);
    }

    return String(value).trim();

}

// ==========================
// PAYMENT VALIDATION
// ==========================
function validatePayment(total, paid) {

    total = Number(total);
    paid = Number(paid);

    if (paid > total) {
        throw new Error(
            "Amount paid cannot exceed total amount."
        );
    }

    return true;

}

// ==========================
// STOCK VALIDATION
// ==========================
function validateStock(quantity) {

    quantity = Number(quantity);

    if (quantity <= 0) {
        throw new Error(
            "Quantity must be greater than zero."
        );
    }

    return true;

}

module.exports = {

    requirePositiveNumber,

    requireText,

    validatePayment,

    validateStock

};