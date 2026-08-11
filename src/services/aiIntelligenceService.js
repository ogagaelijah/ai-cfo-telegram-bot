const businessForecast =
    require("./businessForecastService");

const intelligenceDecisionEngine =
    require("./intelligence/decisionEngine");

// ============================================================
// AI CFO INTELLIGENCE SERVICE
// ============================================================
//
// Architecture:
//
//     Business Data
//          ↓
//     Business Forecast
//          ↓
//     Intelligence Decision Engine
//          ↓
//     AI Intelligence Service
//          ↓
//     AI Chat / Dashboard
//
// Responsibilities:
//
// 1. Get the complete business forecast.
// 2. Run the real Intelligence Decision Engine.
// 3. Select a decision by topic.
// 4. Normalize intelligence data.
// 5. Provide consistent data to AI Chat and Dashboard.
// 6. Provide topic-specific fallback intelligence when the
//    Decision Engine has no matching decision.
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
// SELECT DECISION BY TOPIC
// ============================================================

function findDecisionByTopic(
    decisions,
    topic
) {

    if (
        !Array.isArray(decisions) ||
        decisions.length === 0
    ) {

        return null;
    }


    // ========================================================
    // GENERAL PRIORITY
    // ========================================================

    if (!topic) {

        return (
            decisions[0] ||
            null
        );
    }


    // ========================================================
    // CASH
    // ========================================================

    if (
        topic === "cash"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Liquidity"
            ) ||
            null
        );
    }


    // ========================================================
    // PROFIT
    // ========================================================

    if (
        topic === "profit"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Profitability"
            ) ||
            null
        );
    }


    // ========================================================
    // REVENUE
    // ========================================================

    if (
        topic === "revenue"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Revenue"
            ) ||
            null
        );
    }


    // ========================================================
    // INVENTORY
    // ========================================================

    if (
        topic === "inventory"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Inventory"
            ) ||

            decisions.find(
                decision =>
                    decision.category ===
                    "Inventory Demand"
            ) ||

            decisions.find(
                decision =>
                    decision.category ===
                    "Stock"
            ) ||

            null
        );
    }


    // ========================================================
    // RISK
    // ========================================================

    if (
        topic === "risk"
    ) {

        return (

            decisions.find(
                decision =>
                    decision.severity ===
                    "Critical"
            ) ||

            decisions.find(
                decision =>
                    decision.severity ===
                    "Warning"
            ) ||

            decisions.find(
                decision =>
                    decision.severity ===
                    "Info"
            ) ||

            null
        );
    }


    // ========================================================
    // PRIORITY
    // ========================================================

    if (
        topic === "priority"
    ) {

        return (
            decisions[0] ||
            null
        );
    }


    // ========================================================
    // OVERVIEW
    // ========================================================

    if (
        topic === "overview"
    ) {

        return (
            decisions[0] ||
            null
        );
    }


    // ========================================================
    // SCENARIO
    // ========================================================

    if (
        topic === "scenario"
    ) {

        return null;
    }


    // ========================================================
    // UNKNOWN TOPIC
    // ========================================================

    return (
        decisions[0] ||
        null
    );
}


// ============================================================
// TOPIC-SPECIFIC FALLBACK INTELLIGENCE
// ============================================================

function buildTopicFallback(
    topic,
    businessForecastData,
    revenue,
    profit,
    projectedRevenue,
    projectedProfit,
    confidence,
    executiveSummary
) {

    // ========================================================
    // PROFIT
    // ========================================================

    if (
        topic === "profit"
    ) {

        const netProfit =
            toNumber(
                profit.tomorrowNetProfit
            ) ||

            toNumber(
                profit.tomorrowProfit
            ) ||

            projectedProfit;


        const netMargin =
            toNumber(
                profit.tomorrowNetProfitMargin
            ) ||

            toNumber(
                profit.tomorrowProfitMargin
            );


        const grossProfit =
            toNumber(
                profit.tomorrowGrossProfit
            );


        const grossMargin =
            toNumber(
                profit.tomorrowGrossMargin
            );


        // ----------------------------------------------------
        // PROFITABLE
        // ----------------------------------------------------

        if (
            netProfit > 0
        ) {

            let explanation =
                `The business is currently forecast to remain profitable, with projected net profit of ₦${Math.round(
                    netProfit
                ).toLocaleString()}.`;


            if (
                netMargin > 0
            ) {

                explanation +=
                    ` The projected net profit margin is ${netMargin.toFixed(
                        1
                    )}%.`;
            }


            let recommendation =
                "Continue protecting profit margins while improving sales consistency and monitoring cash flow.";


            if (
                grossMargin > 0 &&
                grossMargin < 30
            ) {

                recommendation =
                    "Profit is positive, but the gross margin is relatively tight. Review product pricing and cost of goods while improving sales consistency.";
            }


            return {

                priority:
                    "Profitability",

                urgency:
                    netMargin >= 20
                        ? "Low"
                        : "Medium",

                explanation,

                recommendation,

                source:
                    "Profit Forecast",

                forecastStatus:
                    "Profitable",

                netProfit,

                netMargin,

                grossProfit,

                grossMargin,

                confidence

            };
        }


        // ----------------------------------------------------
        // LOSS
        // ----------------------------------------------------

        if (
            netProfit < 0
        ) {

            return {

                priority:
                    "Profitability Risk",

                urgency:
                    "High",

                explanation:
                    `The business is currently forecast to lose approximately ₦${Math.abs(
                        Math.round(
                            netProfit
                        )
                    ).toLocaleString()} in net profit.`,

                recommendation:
                    "Review pricing, cost of goods, operating expenses and sales performance immediately to identify the main causes of the projected loss.",

                source:
                    "Profit Forecast",

                forecastStatus:
                    "Loss",

                netProfit,

                netMargin,

                grossProfit,

                grossMargin,

                confidence

            };
        }


        // ----------------------------------------------------
        // BREAK EVEN
        // ----------------------------------------------------

        return {

            priority:
                "Break-Even Performance",

            urgency:
                "Medium",

            explanation:
                "The business is currently forecast to operate around break-even, with little or no projected net profit.",

            recommendation:
                "Focus on increasing revenue and reducing unnecessary costs before increasing spending or inventory commitments.",

            source:
                "Profit Forecast",

            forecastStatus:
                "Break-Even",

            netProfit,

            netMargin,

            grossProfit,

            grossMargin,

            confidence

        };
    }


    // ========================================================
    // REVENUE
    // ========================================================

    if (
        topic === "revenue"
    ) {

        const activeSalesDays =
            toNumber(
                revenue.activeSalesDays
            );


        const growthRate =
            toNumber(
                revenue.growthRate
            );


        if (
            projectedRevenue > 0
        ) {

            let explanation;


            if (
                activeSalesDays > 0
            ) {

                explanation =
                    `Projected revenue is approximately ₦${Math.round(
                        projectedRevenue
                    ).toLocaleString()} per selling day based on the current sales history. The forecast currently uses ${activeSalesDays} active selling day(s).`;

            } else {

                explanation =
                    `Projected revenue is approximately ₦${Math.round(
                        projectedRevenue
                    ).toLocaleString()}.`;
            }


            let recommendation;


            if (
                activeSalesDays < 7
            ) {

                recommendation =
                    "Continue recording sales consistently so the forecasting engine can build a stronger revenue history.";

            } else if (
                growthRate < -20
            ) {

                recommendation =
                    "Review the causes of the revenue decline, strengthen sales activity and monitor the next several selling days closely.";

            } else if (
                growthRate > 20
            ) {

                recommendation =
                    "Maintain the activities driving revenue growth while protecting margins and cash flow.";

            } else {

                recommendation =
                    "Continue monitoring sales performance and identify opportunities to increase consistent daily revenue.";
            }


            return {

                priority:
                    activeSalesDays < 7
                        ? "Limited Revenue History"
                        : "Revenue Performance",

                urgency:
                    activeSalesDays < 7
                        ? "Medium"
                        : (
                            growthRate < -20
                                ? "High"
                                : "Low"
                        ),

                explanation,

                recommendation,

                source:
                    "Revenue Forecast",

                activeSalesDays,

                growthRate,

                projectedRevenue,

                confidence

            };
        }
    }


    // ========================================================
    // CASH
    // ========================================================

    if (
        topic === "cash"
    ) {

        const cash =
            businessForecastData.cash ||
            {};


        const currentCash =
            toNumber(
                cash.currentCash
            );


        const cashBalance =
            toNumber(
                cash.cashBalance
            );


        const availableCash =
            toNumber(
                cash.availableCash
            );


        let cashPosition;


        if (
            Number.isFinite(
                Number(
                    cash.currentCash
                )
            )
        ) {

            cashPosition =
                currentCash;

        } else if (
            Number.isFinite(
                Number(
                    cash.cashBalance
                )
            )
        ) {

            cashPosition =
                cashBalance;

        } else {

            cashPosition =
                availableCash;
        }


        if (
            cashPosition < 0
        ) {

            return {

                priority:
                    "Cash Flow Risk",

                urgency:
                    "High",

                explanation:
                    `Cash is currently negative at ₦${Math.round(
                        cashPosition
                    ).toLocaleString()}. Immediate attention is required to improve liquidity.`,

                recommendation:
                    "Prioritize cash collections, reduce non-essential spending and review all immediate payment obligations.",

                source:
                    "Cash Flow Forecast",

                cashPosition

            };
        }


        if (
            cashPosition > 0
        ) {

            return {

                priority:
                    "Cash Position",

                urgency:
                    "Low",

                explanation:
                    `The business currently has positive cash of approximately ₦${Math.round(
                        cashPosition
                    ).toLocaleString()}.`,

                recommendation:
                    "Protect the current cash position by prioritizing essential spending, collecting outstanding receivables and maintaining adequate liquidity.",

                source:
                    "Cash Flow Forecast",

                cashPosition

            };
        }


        return {

            priority:
                "Cash Position",

            urgency:
                "Medium",

            explanation:
                "The current cash position is approximately ₦0.",

            recommendation:
                "Prioritize cash collections and avoid unnecessary spending until liquidity improves.",

            source:
                "Cash Flow Forecast",

            cashPosition: 0

        };
    }


    // ========================================================
    // INVENTORY
    // ========================================================

    if (
        topic === "inventory"
    ) {

        const inventory =
            businessForecastData.inventory ||
            {};


        const inventoryDemand =
            businessForecastData.inventoryDemand ||
            {};


        const products =
            Array.isArray(
                inventory.products
            )
                ? inventory.products
                : [];


        const demandProducts =
            Array.isArray(
                inventoryDemand.products
            )
                ? inventoryDemand.products
                : [];


        const reorderProducts =
            Array.isArray(
                inventory.productsRequiringReorder
            )
                ? inventory.productsRequiringReorder
                : (
                    Array.isArray(
                        inventory.reorderProducts
                    )
                        ? inventory.reorderProducts
                        : []
                );


        const demandReorderProducts =
            demandProducts.filter(
                product =>
                    product &&
                    (
                        product.reorderRecommendation ===
                            "Urgent" ||

                        product.reorderRecommendation ===
                            "Reorder Immediately" ||

                        product.reorderRecommendation ===
                            "Reorder Soon"
                    )
            );


        const productsRequiringReorder =
            Math.max(
                reorderProducts.length,
                demandReorderProducts.length
            );


        const productCount =
            products.length;


        if (
            productsRequiringReorder > 0
        ) {

            return {

                priority:
                    "Inventory Reorder",

                urgency:
                    "High",

                explanation:
                    `${productsRequiringReorder} product(s) currently require inventory attention.`,

                recommendation:
                    "Review the products requiring reorder and replenish the most important stock before shortages affect sales.",

                source:
                    "Inventory Demand Forecast",

                productsRequiringReorder,

                productCount

            };
        }


        return {

            priority:
                "Inventory Stable",

            urgency:
                "Low",

            explanation:
                "No immediate inventory reorder requirement has been identified from the current inventory forecast.",

            recommendation:
                "Continue monitoring stock levels and reorder before critical inventory shortages occur.",

            source:
                "Inventory Demand Forecast",

            productsRequiringReorder: 0,

            productCount

        };
    }


    // ========================================================
    // RISK
    // ========================================================

    if (
        topic === "risk"
    ) {

        const risks =
            Array.isArray(
                businessForecastData.risks
            )
                ? businessForecastData.risks
                : [];


        const criticalRisks =
            risks.filter(
                risk =>
                    risk.severity ===
                    "Critical"
            ).length;


        const warningRisks =
            risks.filter(
                risk =>
                    risk.severity ===
                    "Warning"
            ).length;


        if (
            criticalRisks > 0
        ) {

            return {

                priority:
                    "Critical Business Risk",

                urgency:
                    "High",

                explanation:
                    `The business currently has ${criticalRisks} critical risk(s) requiring attention.`,

                recommendation:
                    "Address the critical risks first and review their underlying causes before taking lower-priority actions.",

                source:
                    "Risk Forecast",

                criticalRisks,

                warningRisks

            };
        }


        if (
            warningRisks > 0
        ) {

            return {

                priority:
                    "Business Risk",

                urgency:
                    "Medium",

                explanation:
                    `The business currently has ${warningRisks} warning-level risk(s) that should be monitored.`,

                recommendation:
                    "Review the warning risks and take preventive action before they become critical.",

                source:
                    "Risk Forecast",

                criticalRisks,

                warningRisks

            };
        }


        return {

            priority:
                "Risk Monitoring",

            urgency:
                "Low",

            explanation:
                "No critical or warning-level business risks were identified in the available risk forecast.",

            recommendation:
                "Continue monitoring the business for changes in cash flow, revenue, profitability and inventory.",

            source:
                "Risk Forecast",

            criticalRisks: 0,

            warningRisks: 0

        };
    }


    // ========================================================
    // DEFAULT
    // ========================================================

    return {

        priority:
            "Maintain Current Operations",

        urgency:
            "Low",

        explanation:
            executiveSummary.message ||
            "No immediate business decision has been identified from the current financial intelligence.",

        recommendation:
            "Continue recording accurate financial data and monitor business performance regularly.",

        source:
            "Executive Summary"

    };
}


// ============================================================
// BUILD INTELLIGENCE
// ============================================================

function buildIntelligence(
    telegramId,
    topic = null
) {

    // ========================================================
    // STEP 1
    // GET COMPLETE BUSINESS FORECAST
    // ========================================================

    const forecast =
        businessForecast
            .getBusinessForecast(
                telegramId
            );


    const businessForecastData =
        forecast || {};


    // ========================================================
    // STEP 2
    // RUN REAL INTELLIGENCE DECISION ENGINE
    // ========================================================
    //
    // IMPORTANT:
    //
    // The Decision Engine expects an object containing:
    //
    //     risks
    //
    // businessForecastService already provides that property.
    //
    // ========================================================

    const intelligence =
        intelligenceDecisionEngine
            .getDecisionForecast(
                businessForecastData
            );


    const data =
        intelligence || {};


    // ========================================================
    // DECISIONS
    // ========================================================

    const decisions =
        Array.isArray(
            data.decisions
        )
            ? data.decisions
            : (
                Array.isArray(
                    businessForecastData.decisions
                )
                    ? businessForecastData.decisions
                    : []
            );


    // ========================================================
    // SELECT DECISION
    // ========================================================

    const selectedDecision =
        findDecisionByTopic(
            decisions,
            topic
        );


    // ========================================================
    // FORECAST DATA
    // ========================================================

    const forecastData =
        data.forecast ||
        {};


    // ========================================================
    // REVENUE
    // ========================================================

    const revenue =
        businessForecastData.revenue ||
        {};


    const projectedRevenue =
        toNumber(
            businessForecastData.projectedRevenue
        ) ||

        toNumber(
            forecastData.projectedRevenue
        ) ||

        toNumber(
            revenue.projectedRevenue
        ) ||

        toNumber(
            revenue.tomorrowRevenue
        ) ||

        toNumber(
            revenue.tomorrow
        ) ||

        toNumber(
            revenue.averageDailySales
        );


    // ========================================================
    // PROFIT
    // ========================================================

    const profit =
        businessForecastData.profit ||
        {};


    const projectedProfit =
        toNumber(
            businessForecastData.projectedProfit
        ) ||

        toNumber(
            forecastData.projectedProfit
        ) ||

        toNumber(
            profit.projectedProfit
        ) ||

        toNumber(
            profit.tomorrowNetProfit
        ) ||

        toNumber(
            profit.tomorrowProfit
        );


    // ========================================================
    // CONFIDENCE
    // ========================================================

    const confidence =
        toNumber(
            businessForecastData.confidence
        ) ||

        toNumber(
            forecastData.confidence
        ) ||

        toNumber(
            revenue.confidence
        );


    // ========================================================
    // NORMALIZED DECISION COUNTS
    // ========================================================

    const totalDecisions =
        decisions.length;


    const immediateDecisions =
        decisions.filter(
            decision =>
                decision.priority ===
                "Immediate"
        ).length;


    const highPriorityDecisions =
        decisions.filter(
            decision =>
                decision.priority ===
                "High"
        ).length;


    const mediumPriorityDecisions =
        decisions.filter(
            decision =>
                decision.priority ===
                "Medium"
        ).length;


    const lowPriorityDecisions =
        decisions.filter(
            decision =>
                decision.priority ===
                "Low"
        ).length;


    const criticalDecisions =
        decisions.filter(
            decision =>
                decision.severity ===
                "Critical"
        ).length;


    const warningDecisions =
        decisions.filter(
            decision =>
                decision.severity ===
                "Warning"
        ).length;


    const infoDecisions =
        decisions.filter(
            decision =>
                decision.severity ===
                "Info"
        ).length;


    // ========================================================
    // RISKS
    // ========================================================

    const risks =
        Array.isArray(
            businessForecastData.risks
        )
            ? businessForecastData.risks
            : (
                Array.isArray(
                    data.risks
                )
                    ? data.risks
                    : []
            );


    // ========================================================
    // EXECUTIVE SUMMARY
    // ========================================================

    const executiveSummary =
        data.executiveSummary ||
        businessForecastData.executiveSummary ||
        {
            status:
                "Healthy",

            headline:
                "No immediate business decisions are required.",

            message:
                "Current forecasts do not indicate significant conditions requiring immediate management action.",

            topPriority:
                "Maintain Current Operations"
        };


    // ========================================================
    // TOP DECISION
    // ========================================================

    const topDecision =
        data.topDecision ||
        decisions[0] ||
        null;


    // ========================================================
    // NO MATCHING DECISION
    // ========================================================
    //
    // A missing decision does NOT mean there is no
    // intelligence.
    //
    // Profit, revenue, cash and inventory can still be
    // answered directly from forecast data.
    //
    // ========================================================

    if (
        !selectedDecision
    ) {

        const fallback =
            buildTopicFallback(
                topic,
                businessForecastData,
                revenue,
                profit,
                projectedRevenue,
                projectedProfit,
                confidence,
                executiveSummary
            );


        return {

            type:
                data.type ||
                "Full Intelligence",


            telegramId,


            priority:
                fallback.priority,


            urgency:
                fallback.urgency,


            explanation:
                fallback.explanation,


            recommendation:
                fallback.recommendation,


            intelligenceSource:
                fallback.source,


            forecastStatus:
                fallback.forecastStatus ||
                null,


            // ==================================================
            // NORMALIZED FORECAST
            // ==================================================

            forecast: {

                ...forecastData,

                projectedRevenue,

                projectedProfit,

                confidence,


                tomorrowRevenue:
                    toNumber(
                        revenue.tomorrow
                    ) ||

                    toNumber(
                        revenue.tomorrowRevenue
                    ),


                next7DaysRevenue:
                    toNumber(
                        revenue.next7Days
                    ) ||

                    toNumber(
                        revenue.next7DaysRevenue
                    ),


                next30DaysRevenue:
                    toNumber(
                        revenue.next30Days
                    ) ||

                    toNumber(
                        revenue.next30DaysRevenue
                    ),


                tomorrowNetProfit:
                    toNumber(
                        profit.tomorrowNetProfit
                    ) ||

                    toNumber(
                        profit.tomorrowProfit
                    ),


                next7DaysNetProfit:
                    toNumber(
                        profit.next7DaysNetProfit
                    ) ||

                    toNumber(
                        profit.next7DaysProfit
                    ),


                next30DaysNetProfit:
                    toNumber(
                        profit.next30DaysNetProfit
                    ) ||

                    toNumber(
                        profit.next30DaysProfit
                    )

            },


            // ==================================================
            // DECISIONS
            // ==================================================

            decisions,

            totalDecisions,

            immediateDecisions,

            highPriorityDecisions,

            mediumPriorityDecisions,

            lowPriorityDecisions,

            criticalDecisions,

            warningDecisions,

            infoDecisions,


            // ==================================================
            // TOP DECISION
            // ==================================================

            topDecision,


            // ==================================================
            // COMPLETE BUSINESS FORECAST
            // ==================================================

            businessForecast:
                businessForecastData,


            // ==================================================
            // RISKS
            // ==================================================

            risks,


            // ==================================================
            // EXECUTIVE SUMMARY
            // ==================================================

            executiveSummary

        };
    }


    // ========================================================
    // NORMALIZE SELECTED DECISION URGENCY
    // ========================================================

    let urgency =
        "Low";


    if (
        selectedDecision.priority ===
        "Immediate"
    ) {

        urgency =
            "High";

    } else if (
        selectedDecision.priority ===
        "High"
    ) {

        urgency =
            "High";

    } else if (
        selectedDecision.priority ===
        "Medium"
    ) {

        urgency =
            "Medium";
    }


    // ========================================================
    // RETURN COMPLETE INTELLIGENCE
    // ========================================================

    return {

        type:
            data.type ||
            "Full Intelligence",


        telegramId,


        // ====================================================
        // SELECTED DECISION
        // ====================================================

        priority:
            selectedDecision.title ||
            selectedDecision.category ||
            "Maintain Current Operations",


        urgency,


        explanation:
            selectedDecision.reason ||
            selectedDecision.sourceRisk ||
            "The forecast engine identified a business condition that should be monitored.",


        recommendation:
            selectedDecision.decision ||
            "Continue monitoring business performance.",


        intelligenceSource:
            "Decision Engine",


        // ====================================================
        // FORECAST
        // ====================================================

        forecast: {

            ...forecastData,

            projectedRevenue,

            projectedProfit,

            confidence,


            tomorrowRevenue:
                toNumber(
                    revenue.tomorrow
                ) ||

                toNumber(
                    revenue.tomorrowRevenue
                ),


            next7DaysRevenue:
                toNumber(
                    revenue.next7Days
                ) ||

                toNumber(
                    revenue.next7DaysRevenue
                ),


            next30DaysRevenue:
                toNumber(
                    revenue.next30Days
                ) ||

                toNumber(
                    revenue.next30DaysRevenue
                ),


            tomorrowNetProfit:
                toNumber(
                    profit.tomorrowNetProfit
                ) ||

                toNumber(
                    profit.tomorrowProfit
                ),


            next7DaysNetProfit:
                toNumber(
                    profit.next7DaysNetProfit
                ) ||

                toNumber(
                    profit.next7DaysProfit
                ),


            next30DaysNetProfit:
                toNumber(
                    profit.next30DaysNetProfit
                ) ||

                toNumber(
                    profit.next30DaysProfit
                )

        },


        // ====================================================
        // COMPLETE DECISION DATA
        // ====================================================

        decisions,

        totalDecisions,

        immediateDecisions,

        highPriorityDecisions,

        mediumPriorityDecisions,

        lowPriorityDecisions,

        criticalDecisions,

        warningDecisions,

        infoDecisions,


        // ====================================================
        // TOP DECISION
        // ====================================================

        topDecision,


        // ====================================================
        // COMPLETE BUSINESS FORECAST
        // ====================================================

        businessForecast:
            businessForecastData,


        // ====================================================
        // RISKS
        // ====================================================

        risks,


        // ====================================================
        // EXECUTIVE SUMMARY
        // ====================================================

        executiveSummary

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    buildIntelligence,

    findDecisionByTopic,

    buildTopicFallback

};