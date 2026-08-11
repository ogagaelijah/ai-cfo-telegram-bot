// ============================================================
// SCENARIO ENGINE V1
// ============================================================
//
// DETERMINISTIC BUSINESS SCENARIO ANALYSIS
//
// This engine allows the CFO system to answer questions such as:
//
// - What happens if sales fall 20%?
// - What happens if sales increase 10%?
// - What if expenses increase 15%?
// - What happens if revenue drops 30%?
//
// IMPORTANT:
//
// This engine does NOT modify:
//
// - database records
// - actual sales
// - actual expenses
// - actual inventory
// - forecasts
//
// It only creates a simulated scenario.
//
// Future AI models can explain these results later, but the
// underlying calculations remain deterministic and auditable.
//
// ============================================================


// ============================================================
// NUMBER SAFETY
// ============================================================

function toNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// PERCENTAGE SAFETY
// ============================================================

function normalizePercentage(value) {

    const percentage =
        toNumber(value);

    return Math.abs(
        percentage
    );
}


// ============================================================
// MONEY FORMAT
// ============================================================

function formatMoney(value) {

    const number =
        toNumber(value);

    return `₦${Math.round(
        number
    ).toLocaleString()}`;
}


// ============================================================
// APPLY PERCENTAGE CHANGE
// ============================================================
//
// Example:
//
// 100,000 with -20%
// = 80,000
//
// 100,000 with +20%
// = 120,000
//
// IMPORTANT:
//
// Financial calculations can produce tiny floating-point
// precision errors in JavaScript.
//
// Example:
//
// 100,000 * 1.10
//
// may internally become:
//
// 110000.00000000001
//
// The scenario engine therefore rounds the result to two
// decimal places.
//
// This keeps calculations:
//
// - deterministic
// - financially sensible
// - testable
// - accurate to normal currency precision
//
// ============================================================

function applyPercentageChange(
    value,
    percentage
) {

    const base =
        toNumber(value);

    const change =
        toNumber(percentage);

    const result =
        base *
        (
            1 +
            change / 100
        );

    return Number(
        result.toFixed(2)
    );
}


// ============================================================
// SIMULATE REVENUE CHANGE
// ============================================================

function simulateRevenueChange(
    revenue,
    percentage
) {

    const change =
        toNumber(percentage);

    const currentTomorrow =
        toNumber(
            revenue?.tomorrow
        );

    const currentNext7Days =
        toNumber(
            revenue?.next7Days
        );

    const currentNext30Days =
        toNumber(
            revenue?.next30Days
        );

    return {

        tomorrow:
            applyPercentageChange(
                currentTomorrow,
                change
            ),

        next7Days:
            applyPercentageChange(
                currentNext7Days,
                change
            ),

        next30Days:
            applyPercentageChange(
                currentNext30Days,
                change
            )

    };
}


// ============================================================
// SIMULATE EXPENSE CHANGE
// ============================================================
//
// Expense history may contain:
//
// {
//     date: "2026-08-01",
//     expenses: 50000
// }
//
// or:
//
// {
//     date: "2026-08-01",
//     amount: 50000
// }
//
// The engine supports both.
//
// ============================================================

function simulateExpenseChange(
    expenseHistory,
    percentage
) {

    const history =
        Array.isArray(
            expenseHistory
        )
            ? expenseHistory
            : [];

    const change =
        toNumber(
            percentage
        );

    const totalExpenses =
        history.reduce(
            (
                total,
                item
            ) => {

                const amount =
                    item?.expenses !== undefined
                        ? item.expenses
                        : item?.amount;

                return (
                    total +
                    Math.max(
                        0,
                        toNumber(
                            amount
                        )
                    )
                );

            },
            0
        );

    const projectedExpenses =
        applyPercentageChange(
            totalExpenses,
            change
        );

    const additionalExpenses =
        Number(
            (
                projectedExpenses -
                totalExpenses
            ).toFixed(2)
        );

    const direction =
        change < 0
            ? "decrease"
            : change > 0
                ? "increase"
                : "no change";

    return {

        currentExpenses:
            totalExpenses,

        projectedExpenses,

        additionalExpenses,

        direction

    };
}


// ============================================================
// ANALYZE REVENUE SCENARIO
// ============================================================

function analyzeRevenueScenario(
    revenue,
    percentage
) {

    const change =
        toNumber(
            percentage
        );

    const simulated =
        simulateRevenueChange(
            revenue,
            change
        );

    const baseline =
        toNumber(
            revenue?.tomorrow
        );

    const difference =
        Number(
            (
                simulated.tomorrow -
                baseline
            ).toFixed(2)
        );

    const direction =
        change < 0
            ? "decrease"
            : change > 0
                ? "increase"
                : "no change";

    let impact =
        "The scenario produces no material revenue change.";

    if (
        change < 0
    ) {

        impact =
            `Revenue could decrease by approximately ${formatMoney(
                Math.abs(
                    difference
                )
            )} on the next forecast day.`;

    }

    else if (
        change > 0
    ) {

        impact =
            `Revenue could increase by approximately ${formatMoney(
                difference
            )} on the next forecast day.`;

    }

    return {

        type:
            "revenue",

        changePercentage:
            change,

        direction,

        baseline: {

            tomorrow:
                baseline,

            next7Days:
                toNumber(
                    revenue?.next7Days
                ),

            next30Days:
                toNumber(
                    revenue?.next30Days
                )

        },

        scenario:
            simulated,

        difference: {

            tomorrow:
                difference,

            next7Days:
                Number(
                    (
                        simulated.next7Days -
                        toNumber(
                            revenue?.next7Days
                        )
                    ).toFixed(2)
                ),

            next30Days:
                Number(
                    (
                        simulated.next30Days -
                        toNumber(
                            revenue?.next30Days
                        )
                    ).toFixed(2)
                )

        },

        impact

    };
}


// ============================================================
// ANALYZE EXPENSE SCENARIO
// ============================================================

function analyzeExpenseScenario(
    expenseHistory,
    percentage
) {

    const change =
        toNumber(
            percentage
        );

    const result =
        simulateExpenseChange(
            expenseHistory,
            change
        );

    if (
        result.currentExpenses <= 0
    ) {

        return {

            type:
                "expense",

            changePercentage:
                change,

            direction:
                change < 0
                    ? "decrease"
                    : change > 0
                        ? "increase"
                        : "no change",

            baseline:
                0,

            scenario:
                0,

            additionalExpenses:
                0,

            impact:
                "There is not enough expense history to calculate the financial impact of this scenario."

        };
    }

    let impact =
        "The scenario produces no material expense change.";

    if (
        result.additionalExpenses > 0
    ) {

        impact =
            `Expenses could increase by approximately ${formatMoney(
                result.additionalExpenses
            )}.`;

    }

    else if (
        result.additionalExpenses < 0
    ) {

        impact =
            `Expenses could decrease by approximately ${formatMoney(
                Math.abs(
                    result.additionalExpenses
                )
            )}.`;

    }

    return {

        type:
            "expense",

        changePercentage:
            change,

        direction:
            result.direction,

        baseline:
            result.currentExpenses,

        scenario:
            result.projectedExpenses,

        additionalExpenses:
            result.additionalExpenses,

        impact

    };
}


// ============================================================
// ANALYZE CASH IMPACT
// ============================================================
//
// For revenue scenarios:
//
// Additional/reduced revenue is treated as the immediate
// cash-impact proxy in V1.
//
// This is deliberately conservative.
//
// Later versions can incorporate:
//
// - collection timing
// - COGS
// - receivables
// - payment obligations
// - taxes
// - working capital
//
// ============================================================

function analyzeCashImpact(
    cash,
    revenueScenario
) {

    const currentNext7Days =
        toNumber(
            cash?.next7Days
        );

    const currentNext30Days =
        toNumber(
            cash?.next30Days
        );

    const revenueDifference7 =
        toNumber(
            revenueScenario?.difference?.next7Days
        );

    const revenueDifference30 =
        toNumber(
            revenueScenario?.difference?.next30Days
        );

    return {

        baseline: {

            next7Days:
                currentNext7Days,

            next30Days:
                currentNext30Days

        },

        scenario: {

            next7Days:
                Number(
                    (
                        currentNext7Days +
                        revenueDifference7
                    ).toFixed(2)
                ),

            next30Days:
                Number(
                    (
                        currentNext30Days +
                        revenueDifference30
                    ).toFixed(2)
                )

        },

        difference: {

            next7Days:
                revenueDifference7,

            next30Days:
                revenueDifference30

        }

    };
}


// ============================================================
// DETERMINE CASH OUTLOOK
// ============================================================

function determineCashOutlook(
    next7Days,
    next30Days
) {

    const sevenDays =
        toNumber(
            next7Days
        );

    const thirtyDays =
        toNumber(
            next30Days
        );

    if (
        sevenDays < 0 ||
        thirtyDays < 0
    ) {

        return "Critical";

    }

    if (
        sevenDays === 0 ||
        thirtyDays === 0
    ) {

        return "Pressure";

    }

    return "Healthy";
}


// ============================================================
// DETERMINE REVENUE SCENARIO STATUS
// ============================================================
//
// A scenario can have positive cash and still represent a
// meaningful business warning.
//
// Example:
//
// Current cash:
//
//     +₦570,000
//
// Sales fall:
//
//     -20%
//
// Cash may remain positive, but the business has still
// suffered a meaningful deterioration.
//
// Therefore revenue decline percentage is considered in
// addition to the cash outlook.
//
// Rules:
//
// 0% to -9%
//     → retain cash outlook
//
// -10% to -29%
//     → at least Monitor
//
// -30% or worse
//     → at least High
//
// Critical cash conditions always remain Critical.
//
// ============================================================

function determineRevenueScenarioStatus(
    changePercentage,
    cashOutlook
) {

    let status =
        cashOutlook;

    const change =
        toNumber(
            changePercentage
        );

    // Significant revenue decline.
    if (
        change <= -10 &&
        status === "Healthy"
    ) {

        status =
            "Monitor";

    }

    // Severe revenue decline.
    if (
        change <= -30 &&
        (
            status === "Healthy" ||
            status === "Monitor"
        )
    ) {

        status =
            "High";

    }

    return status;
}


// ============================================================
// BUILD REVENUE SCENARIO DECISION
// ============================================================

function buildRevenueScenarioDecision(
    scenario,
    cashImpact
) {

    const change =
        toNumber(
            scenario.changePercentage
        );

    const scenarioCash7 =
        toNumber(
            cashImpact?.scenario?.next7Days
        );

    const scenarioCash30 =
        toNumber(
            cashImpact?.scenario?.next30Days
        );

    // ========================================================
    // REVENUE INCREASE
    // ========================================================

    if (
        change > 0
    ) {

        return {

            priority:
                "Medium",

            action:
                "Use the additional projected revenue to strengthen cash reserves, cover upcoming obligations and improve operating stability.",

            reason:
                `The scenario increases projected revenue by approximately ${formatMoney(
                    scenario.difference.tomorrow
                )} on the next forecast day.`

        };
    }


    // ========================================================
    // NO CHANGE
    // ========================================================

    if (
        change === 0
    ) {

        return {

            priority:
                "Low",

            action:
                "Continue monitoring revenue performance and maintain current operating discipline.",

            reason:
                "The scenario does not change projected revenue."

        };
    }


    // ========================================================
    // SEVERE CASH CONSEQUENCE
    // ========================================================

    if (
        scenarioCash7 < 0 ||
        scenarioCash30 < 0
    ) {

        return {

            priority:
                "Critical",

            action:
                "Protect cash immediately by reducing avoidable expenses, accelerating collections and reviewing the causes of the sales decline.",

            reason:
                "The simulated revenue decline leaves the business with negative projected cash."

        };
    }


    // ========================================================
    // SEVERE REVENUE DECLINE
    // ========================================================

    if (
        change <= -30
    ) {

        return {

            priority:
                "High",

            action:
                "Investigate the causes of the revenue decline immediately and prepare a cash-preservation plan before the decline materially affects operations.",

            reason:
                `A revenue decline of ${Math.abs(
                    change
                )}% would materially reduce expected business revenue.`

        };
    }


    // ========================================================
    // MODERATE REVENUE DECLINE
    // ========================================================

    if (
        change <= -10
    ) {

        return {

            priority:
                "High",

            action:
                "Review sales performance and identify the products, customers or channels most responsible for the decline.",

            reason:
                `A revenue decline of ${Math.abs(
                    change
                )}% would reduce the expected cash available to the business.`

        };
    }


    // ========================================================
    // SMALL REVENUE DECLINE
    // ========================================================

    return {

        priority:
            "Medium",

        action:
            "Monitor sales performance and identify early signs of weakening demand.",

        reason:
            "A small revenue decline would reduce expected revenue but does not currently indicate a severe financial threat."

    };
}


// ============================================================
// BUILD EXPENSE SCENARIO DECISION
// ============================================================

function buildExpenseScenarioDecision(
    scenario
) {

    const change =
        toNumber(
            scenario.changePercentage
        );

    const additionalExpenses =
        toNumber(
            scenario.additionalExpenses
        );


    // ========================================================
    // NO EXPENSE HISTORY
    // ========================================================

    if (
        scenario.baseline <= 0
    ) {

        return {

            priority:
                "Medium",

            action:
                "Continue monitoring expenses and maintain accurate expense records.",

            reason:
                scenario.impact

        };
    }


    // ========================================================
    // EXPENSE REDUCTION
    // ========================================================

    if (
        additionalExpenses < 0
    ) {

        return {

            priority:
                "Medium",

            action:
                "Identify the expense reductions that can be maintained without damaging essential business operations.",

            reason:
                `The simulated expense reduction saves approximately ${formatMoney(
                    Math.abs(
                        additionalExpenses
                    )
                )}.`

        };
    }


    // ========================================================
    // NO CHANGE
    // ========================================================

    if (
        change === 0
    ) {

        return {

            priority:
                "Low",

            action:
                "Continue monitoring expenses and maintain current cost controls.",

            reason:
                "The scenario does not change projected expenses."

        };
    }


    // ========================================================
    // EXPENSE INCREASE
    // ========================================================

    if (
        additionalExpenses > 0
    ) {

        return {

            priority:
                "High",

            action:
                "Review discretionary expenses and identify costs that can be reduced or delayed before the increase affects profitability and cash flow.",

            reason:
                `The simulated expense increase adds approximately ${formatMoney(
                    additionalExpenses
                )} to expenses.`

        };
    }


    return {

        priority:
            "Medium",

        action:
            "Continue monitoring expenses.",

        reason:
            "The scenario does not currently indicate a material expense impact."

    };
}


// ============================================================
// BUILD REVENUE SCENARIO RESULT
// ============================================================

function buildRevenueScenario(
    forecast,
    percentage
) {

    const data =
        forecast || {};

    const revenue =
        data.revenue || {};

    const cash =
        data.cash || {};

    const scenario =
        analyzeRevenueScenario(
            revenue,
            percentage
        );

    const cashImpact =
        analyzeCashImpact(
            cash,
            scenario
        );

    const cashOutlook =
        determineCashOutlook(
            cashImpact.scenario.next7Days,
            cashImpact.scenario.next30Days
        );

    const status =
        determineRevenueScenarioStatus(
            scenario.changePercentage,
            cashOutlook
        );

    const decision =
        buildRevenueScenarioDecision(
            scenario,
            cashImpact
        );

    return {

        scenarioType:
            "Revenue Change",

        status,

        changePercentage:
            scenario.changePercentage,

        direction:
            scenario.direction,

        baseline:
            scenario.baseline,

        projected:
            scenario.scenario,

        revenueImpact:
            scenario.difference,

        cashImpact,

        impact:
            scenario.impact,

        decision

    };
}


// ============================================================
// BUILD EXPENSE SCENARIO RESULT
// ============================================================

function buildExpenseScenario(
    forecast,
    expenseHistory,
    percentage
) {

    const scenario =
        analyzeExpenseScenario(
            expenseHistory,
            percentage
        );

    const decision =
        buildExpenseScenarioDecision(
            scenario
        );

    let status =
        "Monitor";

    if (
        scenario.additionalExpenses > 0
    ) {

        status =
            "Pressure";

    }

    else if (
        scenario.additionalExpenses < 0
    ) {

        status =
            "Healthy";

    }


    return {

        scenarioType:
            "Expense Change",

        status,

        changePercentage:
            scenario.changePercentage,

        direction:
            scenario.direction,

        baseline:
            scenario.baseline,

        projected:
            scenario.scenario,

        additionalExpenses:
            scenario.additionalExpenses,

        impact:
            scenario.impact,

        decision

    };
}


// ============================================================
// MAIN SCENARIO ENGINE
// ============================================================

function buildScenario(
    forecast,
    options = {}
) {

    const data =
        forecast || {};

    const type =
        options.type ||
        "revenue";

    const percentage =
        toNumber(
            options.percentage
        );


    // ========================================================
    // REVENUE SCENARIO
    // ========================================================

    if (
        type ===
        "revenue"
    ) {

        return buildRevenueScenario(
            data,
            percentage
        );
    }


    // ========================================================
    // EXPENSE SCENARIO
    // ========================================================

    if (
        type ===
        "expense"
    ) {

        return buildExpenseScenario(
            data,
            data.expenseHistory || [],
            percentage
        );
    }


    // ========================================================
    // UNKNOWN SCENARIO
    // ========================================================

    return {

        scenarioType:
            "Unknown",

        status:
            "Info",

        changePercentage:
            percentage,

        impact:
            "This scenario type is not supported yet.",

        decision: {

            priority:
                "Low",

            action:
                "Continue monitoring the business and record accurate financial data.",

            reason:
                "The requested scenario type is not yet supported by the scenario engine."

        }

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    buildScenario,

    buildRevenueScenario,

    buildExpenseScenario,

    analyzeRevenueScenario,

    analyzeExpenseScenario,

    simulateRevenueChange,

    simulateExpenseChange,

    analyzeCashImpact,

    determineCashOutlook,

    determineRevenueScenarioStatus,

    formatMoney

};