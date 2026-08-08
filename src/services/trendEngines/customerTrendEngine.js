const customerRepository =
require("../../repositories/customerRepository");

// ==========================
// CUSTOMER TREND ENGINE
// ==========================
function getCustomerTrend(userId) {

    const customers =
        customerRepository.findAll(userId);

    const total =
        customers.length;

    let direction = "Stable";

    if (total === 0) {

        direction = "No Customers";

    }

    if (total >= 10) {

        direction = "Growing";

    }

    return {

        total,

        direction

    };

}

module.exports = {

    getCustomerTrend

};