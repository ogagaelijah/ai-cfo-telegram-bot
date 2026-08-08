const trendsRepository = require("../../repositories/businessTrendsRepository");

// ==========================
// REVENUE TREND ENGINE
// ==========================
function getRevenueTrend(userId) {

    const current =
        trendsRepository.getThisMonthSales(userId);

    const previous =
        trendsRepository.getLastMonthSales(userId);

    let percentage = 0;

    if (previous > 0) {

        percentage =
            ((current - previous) / previous) * 100;

    }

    let direction = "Stable";

    if (percentage > 5) {

        direction = "Growing";

    } else if (percentage < -5) {

        direction = "Declining";

    }

    return {

        current,

        previous,

        percentage,

        direction

    };

}

module.exports = {

    getRevenueTrend

};