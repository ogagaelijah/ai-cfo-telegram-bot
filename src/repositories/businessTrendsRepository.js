const db = require("../database/database");

// ==========================
// GET INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user = db.prepare(`
        SELECT id
        FROM users
        WHERE telegram_id = ?
    `).get(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;
}


// ==========================
// TODAY SALES
// ==========================
function getTodaySales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// YESTERDAY SALES
// ==========================
function getYesterdaySales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', '-1 day', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// THIS WEEK SALES
// ==========================
function getThisWeekSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime')
            >= DATE(
                'now',
                'localtime',
                'weekday 0',
                '-6 days'
            )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// LAST WEEK SALES
// ==========================
function getLastWeekSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime')
        BETWEEN
            DATE(
                'now',
                'localtime',
                'weekday 0',
                '-13 days'
            )
        AND
            DATE(
                'now',
                'localtime',
                'weekday 0',
                '-7 days'
            )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// THIS MONTH SALES
// ==========================
function getThisMonthSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND strftime(
            '%Y-%m',
            created_at,
            'localtime'
        )
        =
        strftime(
            '%Y-%m',
            'now',
            'localtime'
        )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// LAST MONTH SALES
// ==========================
function getLastMonthSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND strftime(
            '%Y-%m',
            created_at,
            'localtime'
        )
        =
        strftime(
            '%Y-%m',
            'now',
            'localtime',
            '-1 month'
        )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// AVERAGE DAILY SALES
// ==========================
function getAverageDailySales(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(
                AVG(daily_total),
                0
            ) AS average

        FROM (
            SELECT

                DATE(
                    created_at,
                    'localtime'
                ) AS day,

                SUM(
                    CASE
                        WHEN revenue > 0
                            THEN revenue
                        ELSE 0
                    END
                ) AS daily_total

            FROM sales

            WHERE user_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )

            HAVING
                daily_total > 0
        )
    `).get(userId);

    return Number(
        result.average
    ) || 0;
}


// ==========================
// AVERAGE DAILY EXPENSES
// ==========================
//
// Calculates average expenses across
// all calendar days in the recorded
// expense history.
//
// Zero-expense days are included.
// ==========================

function getAverageDailyExpenses(telegramId) {

    const userId =
        getUserId(telegramId);

    const result =
        db.prepare(`
            WITH RECURSIVE calendar(date) AS (

                SELECT
                    MIN(
                        DATE(
                            created_at,
                            'localtime'
                        )
                    )

                FROM expenses

                WHERE user_id = ?


                UNION ALL


                SELECT
                    DATE(
                        date,
                        '+1 day'
                    )

                FROM calendar

                WHERE date <
                    DATE(
                        'now',
                        'localtime'
                    )

            )


            SELECT

                COALESCE(
                    AVG(
                        daily_total
                    ),
                    0
                ) AS average

            FROM (

                SELECT

                    calendar.date,

                    COALESCE(
                        SUM(
                            expenses.amount
                        ),
                        0
                    ) AS daily_total

                FROM calendar

                LEFT JOIN expenses

                    ON DATE(
                        expenses.created_at,
                        'localtime'
                    )
                    =
                    calendar.date

                    AND expenses.user_id = ?

                GROUP BY
                    calendar.date

            )

        `).get(
            userId,
            userId
        );

    return Number(
        result.average
    ) || 0;
}


// ==========================
// AVERAGE DAILY PURCHASES
// ==========================
//
// Calculates the average cash paid
// on days where purchase payments
// actually occurred.
//
// This metric is intentionally kept
// separate from the calendar-day
// purchase cash-outflow metric below.
//
// ==========================

function getAverageDailyPurchases(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(
                AVG(daily_cash_paid),
                0
            ) AS average

        FROM (
            SELECT

                DATE(
                    created_at,
                    'localtime'
                ) AS day,

                SUM(
                    amount_paid
                ) AS daily_cash_paid

            FROM purchases

            WHERE user_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )
        )

    `).get(
        userId
    );

    return Number(
        result.average
    ) || 0;
}


// ==========================
// AVERAGE DAILY PURCHASE CASH OUTFLOW
// ==========================
//
// Measures actual supplier cash
// payments across the complete
// calendar forecasting period.
//
// Unlike getAverageDailyPurchases(),
// this metric does NOT ignore days
// where no purchase payment occurred.
//
// Example:
//
// 30-day period:
//
// Total cash paid to suppliers
// = ₦238,000
//
// Average daily purchase cash
// outflow:
//
// ₦238,000 / 30
//
// = ₦7,933.33
//
// This metric is specifically
// intended for CASH FLOW forecasting.
//
// It is different from:
//
// PURCHASE VALUE
//     → total_amount
//
// COGS
//     → cost_of_goods from sales
//
// PURCHASE-DAY PAYMENT AVERAGE
//     → getAverageDailyPurchases()
//
// SUPPLIER BALANCE
//     → outstanding amount owed
//
// ==========================

function getAverageDailyPurchaseCashOutflow(
    telegramId,
    days = 30
) {

    const userId =
        getUserId(telegramId);


    const safeDays =
        Number(days) > 0
            ? Math.floor(
                Number(days)
            )
            : 30;


    const result =
        db.prepare(`

            SELECT

                COALESCE(
                    SUM(
                        amount_paid
                    ),
                    0
                ) AS total_cash_paid

            FROM purchases

            WHERE user_id = ?

                AND DATE(
                    created_at,
                    'localtime'
                ) >= DATE(
                    'now',
                    'localtime',
                    ?
                )

        `).get(
            userId,
            `-${safeDays} days`
        );


    const totalCashPaid =
        Number(
            result.total_cash_paid
        ) || 0;


    return (
        totalCashPaid /
        safeDays
    );
}


// ==========================
// DAILY PURCHASE HISTORY
// ==========================
function getDailyPurchases(
    userId,
    days = 30
) {

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(total_amount),
                0
            ) AS purchases

        FROM purchases

        WHERE user_id = ?

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) DESC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            purchases:
                Number(
                    row.purchases
                ) || 0

        })
    );
}


// ==========================
// DAILY SALES HISTORY
// ==========================
function getDailySales(
    userId,
    days = 30
) {

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(total),
                0
            ) AS sales

        FROM sales

        WHERE user_id = ?

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) DESC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            sales:
                Number(
                    row.sales
                ) || 0

        })
    );
}


// ==========================
// DAILY EXPENSE HISTORY
// ==========================
function getDailyExpenses(
    userId,
    days = 30
) {

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(amount),
                0
            ) AS expenses

        FROM expenses

        WHERE user_id = ?

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) DESC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            expenses:
                Number(
                    row.expenses
                ) || 0

        })
    );
}


// ==========================
// PRODUCT DAILY DEMAND HISTORY
// ==========================
//
// Returns product-level daily
// quantities sold.
//
// A sale does not always have an
// inventory_id.
//
// Therefore:
// 1. LEFT JOIN is used.
// 2. inventory.product_name is preferred.
// 3. sales.item is used as fallback.
//
// ==========================

function getProductDailyDemand(
    telegramId,
    days = 30
) {

    const userId =
        getUserId(telegramId);

    const rows =
        db.prepare(`
            SELECT

                COALESCE(
                    inventory.product_name,
                    sales.item
                ) AS product_name,

                DATE(
                    sales.created_at,
                    'localtime'
                ) AS date,

                COALESCE(
                    SUM(sales.quantity),
                    0
                ) AS quantity

            FROM sales

            LEFT JOIN inventory
                ON inventory.id =
                   sales.inventory_id

            WHERE sales.user_id = ?

            AND DATE(
                sales.created_at,
                'localtime'
            ) >= DATE(
                'now',
                'localtime',
                '-29 days'
            )

            GROUP BY

                COALESCE(
                    inventory.product_name,
                    sales.item
                ),

                DATE(
                    sales.created_at,
                    'localtime'
                )

            ORDER BY

                date ASC,

                product_name ASC

            LIMIT ?

        `).all(

            userId,

            days * 100
        );

    return rows.map(
        row => ({

            product_name:
                row.product_name,

            date:
                row.date,

            quantity:
                Number(
                    row.quantity
                ) || 0

        })
    );
}


// ==========================
// DAILY COGS HISTORY
// ==========================
//
// IMPORTANT:
//
// This function receives the
// TELEGRAM ID, just like the other
// higher-level repository functions
// that use getUserId().
//
// It converts the Telegram ID into
// the internal database user ID before
// querying the sales table.
//
// COGS represents the cost of
// inventory actually sold.
//
// It does NOT represent purchases.
//
// ==========================

function getDailyCOGS(
    telegramId,
    days = 30
) {

    const userId =
        getUserId(telegramId);

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(revenue),
                0
            ) AS revenue,

            COALESCE(
                SUM(cost_of_goods),
                0
            ) AS costOfGoods

        FROM sales

        WHERE user_id = ?

        AND DATE(
            created_at,
            'localtime'
        ) >= DATE(
            'now',
            'localtime',
            '-29 days'
        )

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) ASC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            revenue:
                Number(
                    row.revenue
                ) || 0,

            costOfGoods:
                Number(
                    row.costOfGoods
                ) || 0

        })
    );
}


// ==========================
// EXPORT
// ==========================
module.exports = {

    getUserId,

    getTodaySales,

    getYesterdaySales,

    getThisWeekSales,

    getLastWeekSales,

    getThisMonthSales,

    getLastMonthSales,

    getAverageDailySales,

    getAverageDailyExpenses,

    getAverageDailyPurchases,

    getAverageDailyPurchaseCashOutflow,

    getDailyPurchases,

    getDailySales,

    getDailyExpenses,

    getProductDailyDemand,

    getDailyCOGS

};