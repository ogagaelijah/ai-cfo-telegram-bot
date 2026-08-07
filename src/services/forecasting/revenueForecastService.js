const salesRepository = require("../../repositories/salesRepository");

// ==========================
// REVENUE FORECAST ENGINE
// ==========================
function getRevenueForecast(userId) {

    const sales =
        salesRepository.getLast30DaysSales(userId);

    if (!sales.length) {

        return {

            averageDailySales: 0,

            growthRate: 0,

            trend: "No Data",

            confidence: 0,

            tomorrow: 0,

            next7Days: 0,

            next30Days: 0

        };

    }

    // ==========================
    // TOTAL SALES
    // ==========================
    const totalRevenue =
        sales.reduce((sum, sale) => {

            return sum + Number(sale.total || 0);

        }, 0);

    const averageDailySales =
        totalRevenue / sales.length;

    // ==========================
    // FIRST HALF
    // ==========================
    const midpoint =
        Math.floor(sales.length / 2);

    const firstHalf =
        sales.slice(0, midpoint);

    const secondHalf =
        sales.slice(midpoint);

    const firstAverage =
        firstHalf.length
            ? firstHalf.reduce(
                  (sum, sale) => sum + Number(sale.total || 0),
                  0
              ) / firstHalf.length
            : averageDailySales;

    const secondAverage =
        secondHalf.length
            ? secondHalf.reduce(
                  (sum, sale) => sum + Number(sale.total || 0),
                  0
              ) / secondHalf.length
            : averageDailySales;

    // ==========================
    // GROWTH RATE
    // ==========================
    let growthRate = 0;

    if (firstAverage > 0) {

        growthRate =
            ((secondAverage - firstAverage) / firstAverage) * 100;

    }

    // ==========================
    // TREND
    // ==========================
    let trend = "Stable";

    if (growthRate > 10) {

        trend = "Increasing";

    }

    else if (growthRate < -10) {

        trend = "Declining";

    }

    // ==========================
    // CONFIDENCE
    // ==========================
    let confidence = 95;

    if (sales.length < 30) {

        confidence = 80;

    }

    if (sales.length < 14) {

        confidence = 65;

    }

    if (sales.length < 7) {

        confidence = 50;

    }

    // ==========================
    // FORECAST
    // ==========================
    const tomorrow =
        averageDailySales * (1 + growthRate / 100);

    const next7Days =
        tomorrow * 7;

    const next30Days =
        tomorrow * 30;

    return {

        averageDailySales,

        growthRate,

        trend,

        confidence,

        tomorrow,

        next7Days,

        next30Days

    };

}

module.exports = {

    getRevenueForecast

};