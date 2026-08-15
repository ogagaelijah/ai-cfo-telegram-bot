const incomeRepository =
    require("../../repositories/incomeRepository");

const expenseRepository =
    require("../../repositories/expenseRepository");


// ======================================================
// PERSONAL CASH FLOW SERVICE
// ======================================================
//
// INTERFACE-NEUTRAL SERVICE
//
// This service contains PERSONAL CASH FLOW logic.
//
// It does NOT know about:
//
// - Telegram
// - ctx
// - telegramId
// - keyboards
// - sessions
// - HTTP
// - mobile apps
//
// It receives an already-resolved accountId.
//
// Architecture:
//
// Telegram / Web / Mobile / API
//              ↓
//     Personal Cash Flow
//       Application
//              ↓
//     Personal Cash Flow
//          Service
//              ↓
//     Shared Repositories
//        ↓           ↓
//     income      expenses
//              ↓
//           Database
//
// ======================================================


// ======================================================
// BUILD CASH FLOW
// ======================================================

function buildCashFlow(
    income,
    expenses
) {

    const cashIn =
        Number(income) || 0;


    const cashOut =
        Number(expenses) || 0;


    const netCashFlow =
        cashIn - cashOut;


    return {

        cashIn,

        cashOut,

        netCashFlow

    };

}


// ======================================================
// WEEKLY TOTAL HELPERS
// ======================================================
//
// The repository methods currently shown in the existing
// service support TODAY and MONTHLY totals.
//
// We therefore calculate the current week and current
// year from the records returned by findAll().
//
// No interface-specific logic is used here.
// ======================================================


function getStartOfCurrentWeek() {

    const now =
        new Date();


    const date =
        new Date(now);


    const day =
        date.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    date.setDate(
        date.getDate() - difference
    );


    date.setHours(
        0,
        0,
        0,
        0
    );


    return date;

}


function getStartOfCurrentYear() {

    const now =
        new Date();


    return new Date(
        now.getFullYear(),
        0,
        1,
        0,
        0,
        0,
        0
    );

}


function recordDate(
    record
) {

    if (!record || !record.created_at) {

        return null;

    }


    const date =
        new Date(
            record.created_at
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


function getRecordsTotalFromDate(
    records,
    startDate
) {

    const startTime =
        startDate.getTime();


    return records.reduce(

        (
            total,
            record
        ) => {

            const date =
                recordDate(
                    record
                );


            if (!date) {

                return total;

            }


            if (
                date.getTime() >=
                startTime
            ) {

                return (
                    total +
                    (
                        Number(
                            record.amount
                        ) || 0
                    )
                );

            }


            return total;

        },

        0

    );

}


// ======================================================
// TODAY
// ======================================================

function getTodayCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const income =
        incomeRepository.getTodayTotal(
            accountId
        );


    const expenses =
        expenseRepository.getTodayTotal(
            accountId
        );


    return buildCashFlow(
        income,
        expenses
    );

}


// ======================================================
// CURRENT WEEK
// ======================================================

function getCurrentWeekCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const incomeRecords =
        incomeRepository.findAll(
            accountId
        );


    const expenseRecords =
        expenseRepository.findAll(
            accountId
        );


    const startOfWeek =
        getStartOfCurrentWeek();


    const income =
        getRecordsTotalFromDate(
            incomeRecords,
            startOfWeek
        );


    const expenses =
        getRecordsTotalFromDate(
            expenseRecords,
            startOfWeek
        );


    return buildCashFlow(
        income,
        expenses
    );

}


// ======================================================
// CURRENT MONTH
// ======================================================

function getCurrentMonthCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const income =
        incomeRepository.getMonthlyTotal(
            accountId
        );


    const expenses =
        expenseRepository.getMonthlyTotal(
            accountId
        );


    return buildCashFlow(
        income,
        expenses
    );

}


// ======================================================
// CURRENT YEAR
// ======================================================

function getCurrentYearCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const incomeRecords =
        incomeRepository.findAll(
            accountId
        );


    const expenseRecords =
        expenseRepository.findAll(
            accountId
        );


    const startOfYear =
        getStartOfCurrentYear();


    const income =
        getRecordsTotalFromDate(
            incomeRecords,
            startOfYear
        );


    const expenses =
        getRecordsTotalFromDate(
            expenseRecords,
            startOfYear
        );


    return buildCashFlow(
        income,
        expenses
    );

}


// ======================================================
// ALL TIME
// ======================================================

function getAllTimeCashFlow(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const income =
        incomeRepository
            .findAll(accountId)
            .reduce(

                (
                    total,
                    record
                ) => {

                    return (
                        total +
                        (
                            Number(
                                record.amount
                            ) || 0
                        )
                    );

                },

                0

            );


    const expenses =
        expenseRepository
            .findAll(accountId)
            .reduce(

                (
                    total,
                    record
                ) => {

                    return (
                        total +
                        (
                            Number(
                                record.amount
                            ) || 0
                        )
                    );

                },

                0

            );


    return buildCashFlow(
        income,
        expenses
    );

}


// ======================================================
// WEEKLY INFLOW
// ======================================================

function getWeeklyInflows(
    accountId
) {

    return getCurrentWeekCashFlow(
        accountId
    ).cashIn;

}


// ======================================================
// MONTHLY INFLOW
// ======================================================

function getMonthlyInflows(
    accountId
) {

    return getCurrentMonthCashFlow(
        accountId
    ).cashIn;

}


// ======================================================
// YEARLY INFLOW
// ======================================================

function getYearlyInflows(
    accountId
) {

    return getCurrentYearCashFlow(
        accountId
    ).cashIn;

}


// ======================================================
// WEEKLY OUTFLOW
// ======================================================

function getWeeklyOutflows(
    accountId
) {

    return getCurrentWeekCashFlow(
        accountId
    ).cashOut;

}


// ======================================================
// MONTHLY OUTFLOW
// ======================================================

function getMonthlyOutflows(
    accountId
) {

    return getCurrentMonthCashFlow(
        accountId
    ).cashOut;

}


// ======================================================
// YEARLY OUTFLOW
// ======================================================

function getYearlyOutflows(
    accountId
) {

    return getCurrentYearCashFlow(
        accountId
    ).cashOut;

}


// ======================================================
// WEEKLY NET CASH FLOW
// ======================================================

function getWeeklyNetCashFlow(
    accountId
) {

    return getCurrentWeekCashFlow(
        accountId
    ).netCashFlow;

}


// ======================================================
// MONTHLY NET CASH FLOW
// ======================================================

function getMonthlyNetCashFlow(
    accountId
) {

    return getCurrentMonthCashFlow(
        accountId
    ).netCashFlow;

}


// ======================================================
// YEARLY NET CASH FLOW
// ======================================================

function getYearlyNetCashFlow(
    accountId
) {

    return getCurrentYearCashFlow(
        accountId
    ).netCashFlow;

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getTodayCashFlow,

    getCurrentWeekCashFlow,

    getCurrentMonthCashFlow,

    getCurrentYearCashFlow,

    getAllTimeCashFlow,

    getWeeklyInflows,

    getMonthlyInflows,

    getYearlyInflows,

    getWeeklyOutflows,

    getMonthlyOutflows,

    getYearlyOutflows,

    getWeeklyNetCashFlow,

    getMonthlyNetCashFlow,

    getYearlyNetCashFlow

};