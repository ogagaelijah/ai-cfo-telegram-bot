const {
    getRevenueForecast
} = require("./revenueForecastService");

const {
    getCashForecast
} = require("./cashForecastService");

const {
    getInventoryForecast
} = require("./inventoryForecastService");

// ==========================
// RISK FORECAST ENGINE
// ==========================
function getRiskForecast(userId) {

    const revenue =
        getRevenueForecast(userId);

    const cash =
        getCashForecast(userId);

    const inventory =
        getInventoryForecast(userId);

    const risks = [];

    // ==========================
    // CASH RISK
    // ==========================
    if (cash.status === "Critical") {

        risks.push({

            severity: "Critical",

            title: "Cash Flow Risk",

            message:
                "Business may experience cash shortages if spending continues."

        });

    }

    // ==========================
    // SALES RISK
    // ==========================
    if (revenue.trend === "Declining") {

        risks.push({

            severity: "Warning",

            title: "Sales Trend",

            message:
                "Sales are trending downward."

        });

    }

    // ==========================
    // INVENTORY RISK
    // ==========================
    if (inventory.restockUrgency === "Critical") {

        risks.push({

            severity: "Critical",

            title: "Inventory",

            message:
                "One or more products are out of stock."

        });

    }

    // ==========================
    // NO RISKS
    // ==========================
    if (!risks.length) {

        risks.push({

            severity: "Info",

            title: "Business Outlook",

            message:
                "No significant financial risks predicted."

        });

    }

    return risks;

}

module.exports = {

    getRiskForecast

};