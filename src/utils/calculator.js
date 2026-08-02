function calculateSaleTotal(quantity, price) {

    return Number(quantity) * Number(price);

}

function calculateProfit(income, expense) {

    return Number(income) - Number(expense);

}

function calculatePercentage(value, total) {

    if (total === 0) {

        return 0;

    }

    return (value / total) * 100;

}

module.exports = {

    calculateSaleTotal,
    calculateProfit,
    calculatePercentage

};