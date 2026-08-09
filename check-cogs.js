const db = require("./src/database/database");

const rows = db.prepare(`
    SELECT
        DATE(created_at, 'localtime') AS date,
        SUM(revenue) AS revenue,
        SUM(cost_of_goods) AS cogs,
        SUM(profit) AS grossProfit
    FROM sales
    WHERE user_id = ?
    GROUP BY DATE(created_at, 'localtime')
    ORDER BY date ASC
`).all(1);

console.dir(rows, { depth: null });
