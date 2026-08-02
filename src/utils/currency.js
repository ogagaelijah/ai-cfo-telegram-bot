function formatMoney(amount) {

    const value = Number(amount) || 0;

    return `₦${value.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

}

module.exports = {

    formatMoney

};