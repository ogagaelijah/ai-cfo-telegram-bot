// ==========================
// CFO OBSERVATION SECTION
// ==========================
function buildObservationSection(report) {

    const observations = [];

    // ==========================
    // PROFITABLE BUT NEGATIVE CASH
    // ==========================
    if (
        report.snapshot.netProfit > 0 &&
        report.cash.cashPosition < 0
    ) {

        observations.push(
            "Although your business is profitable, cash is leaving the business faster than it is coming in. This usually indicates slow customer collections or excessive spending."
        );

    }

    // ==========================
    // LOW GROSS MARGIN
    // ==========================
    if (report.snapshot.grossMargin < 20) {

        observations.push(
            "Your gross margin is below the recommended level. Review pricing or negotiate better supplier prices to improve profitability."
        );

    }

    // ==========================
    // HIGH CUSTOMER DEBTS
    // ==========================
    if (report.debt.debtors > report.snapshot.sales * 0.30) {

        observations.push(
            "A significant portion of your sales is still unpaid by customers. Improving collections will strengthen your cash flow."
        );

    }

    // ==========================
    // HIGH SUPPLIER DEBTS
    // ==========================
    if (report.debt.creditors > report.debt.debtors) {

        observations.push(
            "Supplier obligations exceed customer receivables. Monitor repayment schedules carefully to maintain supplier confidence."
        );

    }

    // ==========================
    // HEALTHY BUSINESS
    // ==========================
    if (observations.length === 0) {

        observations.push(
            "Your business is performing well overall. Continue maintaining healthy cash flow, profitability and accurate financial records."
        );

    }

    return `🧠 CFO OBSERVATION

${observations.join("\n\n")}`;

}

module.exports = {

    buildObservationSection

};