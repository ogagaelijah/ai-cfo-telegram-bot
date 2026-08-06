// ==========================
// FORMAT CURRENCY
// ==========================
function formatCurrency(amount) {

    return `₦${Number(amount || 0).toLocaleString()}`;

}

// ==========================
// FORMAT PERCENTAGE
// ==========================
function formatPercentage(value) {

    return `${Number(value || 0).toFixed(2)}%`;

}

// ==========================
// FORMAT SCORE
// ==========================
function formatScore(score) {

    return `${score}/100`;

}

module.exports = {

    formatCurrency,

    formatPercentage,

    formatScore

};