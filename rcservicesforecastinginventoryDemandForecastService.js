[1mdiff --git a/src/repositories/historyRepository.js b/src/repositories/historyRepository.js[m
[1mindex fc19c9a..82ab170 100644[m
[1m--- a/src/repositories/historyRepository.js[m
[1m+++ b/src/repositories/historyRepository.js[m
[36m@@ -1,27 +1,41 @@[m
[31m-const db = require("../database/database");[m
[32m+[m[32mconst db =[m
[32m+[m[32m    require("../database/database");[m
 [m
[31m-[m
[31m-// ==========================[m
[32m+[m[32m// ============================================================[m
 // DAILY SALES HISTORY[m
[31m-// ==========================[m
[31m-function getDailySales(userId, days = 30) {[m
[32m+[m[32m// ============================================================[m
[32m+[m
[32m+[m[32mfunction getDailySales([m
[32m+[m[32m    userId,[m
[32m+[m[32m    days = 30[m
[32m+[m[32m) {[m
 [m
     const rows =[m
         db.prepare(`[m
             WITH RECURSIVE dates(date) AS ([m
 [m
                 SELECT[m
[31m-                    DATE('now', 'localtime', '-29 days')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        'now',[m
[32m+[m[32m                        'localtime',[m
[32m+[m[32m                        '-29 days'[m
[32m+[m[32m                    )[m
 [m
                 UNION ALL[m
 [m
                 SELECT[m
[31m-                    DATE(date, '+1 day')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        date,[m
[32m+[m[32m                        '+1 day'[m
[32m+[m[32m                    )[m
 [m
                 FROM dates[m
 [m
                 WHERE date <[m
[31m-                    DATE('now', 'localtime')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        'now',[m
[32m+[m[32m                        'localtime'[m
[32m+[m[32m                    )[m
 [m
             )[m
 [m
[36m@@ -38,6 +52,7 @@[m [mfunction getDailySales(userId, days = 30) {[m
 [m
             LEFT JOIN sales[m
                 ON sales.user_id = ?[m
[32m+[m
                 AND DATE([m
                     sales.created_at,[m
                     'localtime'[m
[36m@@ -57,40 +72,58 @@[m [mfunction getDailySales(userId, days = 30) {[m
         );[m
 [m
 [m
[31m-    return rows.map(row => ({[m
[32m+[m[32m    return rows.map([m
[32m+[m[32m        row => ({[m
 [m
[31m-        date:[m
[31m-            row.date,[m
[32m+[m[32m            date:[m
[32m+[m[32m                row.date,[m
 [m
[31m-        sales:[m
[31m-            Number(row.sales) || 0[m
[32m+[m[32m            sales:[m
[32m+[m[32m                Number([m
[32m+[m[32m                    row.sales[m
[32m+[m[32m                ) || 0[m
 [m
[31m-    }));[m
[32m+[m[32m        })[m
[32m+[m[32m    );[m
 [m
 }[m
 [m
 [m
[31m-// ==========================[m
[32m+[m[32m// ============================================================[m
 // DAILY PROFITS[m
[31m-// ==========================[m
[31m-function getDailyProfit(userId, days = 30) {[m
[32m+[m[32m// ============================================================[m
[32m+[m
[32m+[m[32mfunction getDailyProfit([m
[32m+[m[32m    userId,[m
[32m+[m[32m    days = 30[m
[32m+[m[32m) {[m
 [m
     const rows =[m
         db.prepare(`[m
             WITH RECURSIVE dates(date) AS ([m
 [m
                 SELECT[m
[31m-                    DATE('now', 'localtime', '-29 days')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        'now',[m
[32m+[m[32m                        'localtime',[m
[32m+[m[32m                        '-29 days'[m
[32m+[m[32m                    )[m
 [m
                 UNION ALL[m
 [m
                 SELECT[m
[31m-                    DATE(date, '+1 day')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        date,[m
[32m+[m[32m                        '+1 day'[m
[32m+[m[32m                    )[m
 [m
                 FROM dates[m
 [m
                 WHERE date <[m
[31m-                    DATE('now', 'localtime')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        'now',[m
[32m+[m[32m                        'localtime'[m
[32m+[m[32m                    )[m
 [m
             )[m
 [m
[36m@@ -107,6 +140,7 @@[m [mfunction getDailyProfit(userId, days = 30) {[m
 [m
             LEFT JOIN sales[m
                 ON sales.user_id = ?[m
[32m+[m
                 AND DATE([m
                     sales.created_at,[m
                     'localtime'[m
[36m@@ -126,22 +160,27 @@[m [mfunction getDailyProfit(userId, days = 30) {[m
         );[m
 [m
 [m
[31m-    return rows.map(row => ({[m
[32m+[m[32m    return rows.map([m
[32m+[m[32m        row => ({[m
 [m
[31m-        date:[m
[31m-            row.date,[m
[32m+[m[32m            date:[m
[32m+[m[32m                row.date,[m
 [m
[31m-        profit:[m
[31m-            Number(row.profit) || 0[m
[32m+[m[32m            profit:[m
[32m+[m[32m                Number([m
[32m+[m[32m                    row.profit[m
[32m+[m[32m                ) || 0[m
 [m
[31m-    }));[m
[32m+[m[32m        })[m
[32m+[m[32m    );[m
 [m
 }[m
 [m
 [m
[31m-// ==========================[m
[32m+[m[32m// ============================================================[m
 // DAILY EXPENSES[m
[31m-// ==========================[m
[32m+[m[32m// ============================================================[m
[32m+[m
 function getDailyExpenses([m
     userId,[m
     days = 30[m
[36m@@ -152,17 +191,27 @@[m [mfunction getDailyExpenses([m
             WITH RECURSIVE dates(date) AS ([m
 [m
                 SELECT[m
[31m-                    DATE('now', 'localtime', '-29 days')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        'now',[m
[32m+[m[32m                        'localtime',[m
[32m+[m[32m                        '-29 days'[m
[32m+[m[32m                    )[m
 [m
                 UNION ALL[m
 [m
                 SELECT[m
[31m-                    DATE(date, '+1 day')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        date,[m
[32m+[m[32m                        '+1 day'[m
[32m+[m[32m                    )[m
 [m
                 FROM dates[m
 [m
                 WHERE date <[m
[31m-                    DATE('now', 'localtime')[m
[32m+[m[32m                    DATE([m
[32m+[m[32m                        'now',[m
[32m+[m[32m                        'localtime'[m
[32m+[m[32m                    )[m
 [m
             )[m
 [m
[36m@@ -179,6 +228,7 @@[m [mfunction getDailyExpenses([m
 [m
             LEFT JOIN expenses[m
                 ON expenses.user_id = ?[m
[32m+[m
                 AND DATE([m
                     expenses.created_at,[m
                     'localtime'[m
[36m@@ -198,28 +248,160 @@[m [mfunction getDailyExpenses([m
         );[m
 [m
 [m
[31m-    return rows.map(row => ({[m
[32m+[m[32m    return rows.map([m
[32m+[m[32m        row => ({[m
[32m+[m
[32m+[m[32m            date:[m
[32m+[m[32m                row.date,[m
[32m+[m
[32m+[m[32m            expenses:[m
[32m+[m[32m                Number([m
[32m+[m[32m                    row.expenses[m
[32m+[m[32m                ) || 0[m
[32m+[m
[32m+[m[32m        })[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m}[m
[32m+[m
[32m+[m
[32m+[m[32m// ============================================================[m
[32m+[m[32m// PRODUCT DAILY DEMAND HISTORY[m
[32m+[m[32m// ============================================================[m
[32m+[m[32m//[m
[32m+[m[32m// Returns the number of units sold for each product on each[m
[32m+[m[32m// calendar day.[m
[32m+[m[32m//[m
[32m+[m[32m// This is intentionally different from getDailySales().[m
[32m+[m[32m//[m
[32m+[m[32m// getDailySales():[m
[32m+[m[32m//     → business-level revenue[m
[32m+[m[32m//[m
[32m+[m[32m// getProductDailyDemand():[m
[32m+[m[32m//     → product-level unit demand[m
[32m+[m[32m//[m
[32m+[m[32m// This data will be used by the inventory demand forecasting[m
[32m+[m[32m// engine.[m
[32m+[m[32m//[m
[32m+[m[32m// ============================================================[m
[32m+[m
[32m+[m[32mfunction getProductDailyDemand([m
[32m+[m[32m    userId,[m
[32m+[m[32m    days = 30[m
[32m+[m[32m) {[m
[32m+[m
[32m+[m[32m    const rows =[m
[32m+[m[32m        db.prepare(`[m
[32m+[m[32m            SELECT[m
[32m+[m
[32m+[m[32m                DATE([m
[32m+[m[32m                    s.created_at,[m
[32m+[m[32m                    'localtime'[m
[32m+[m[32m                ) AS date,[m
[32m+[m
[32m+[m[32m                s.inventory_id AS inventoryId,[m
[32m+[m
[32m+[m[32m                COALESCE([m
[32m+[m[32m                    i.product_name,[m
[32m+[m[32m                    s.item[m
[32m+[m[32m                ) AS productName,[m
[32m+[m
[32m+[m[32m                SUM([m
[32m+[m[32m                    COALESCE([m
[32m+[m[32m                        s.quantity,[m
[32m+[m[32m                        0[m
[32m+[m[32m                    )[m
[32m+[m[32m                ) AS unitsSold[m
[32m+[m
[32m+[m[32m            FROM sales s[m
[32m+[m
[32m+[m[32m            LEFT JOIN inventory i[m
[32m+[m[32m                ON i.id =[m
[32m+[m[32m                    s.inventory_id[m
[32m+[m
[32m+[m[32m                AND i.user_id =[m
[32m+[m[32m                    s.user_id[m
[32m+[m
[32m+[m[32m            WHERE[m
[32m+[m[32m                s.user_id = ?[m
[32m+[m
[32m+[m[32m                AND DATE([m
[32m+[m[32m                    s.created_at,[m
[32m+[m[32m                    'localtime'[m
[32m+[m[32m                ) >= DATE([m
[32m+[m[32m                    'now',[m
[32m+[m[32m                    'localtime',[m
[32m+[m[32m                    ?[m
[32m+[m[32m                )[m
[32m+[m
[32m+[m[32m            GROUP BY[m
[32m+[m
[32m+[m[32m                DATE([m
[32m+[m[32m                    s.created_at,[m
[32m+[m[32m                    'localtime'[m
[32m+[m[32m                ),[m
[32m+[m
[32m+[m[32m                s.inventory_id,[m
[32m+[m
[32m+[m[32m                COALESCE([m
[32m+[m[32m                    i.product_name,[m
[32m+[m[32m                    s.item[m
[32m+[m[32m                )[m
[32m+[m
[32m+[m[32m            ORDER BY[m
[32m+[m[32m                date ASC,[m
[32m+[m
[32m+[m[32m                productName ASC[m
[32m+[m
[32m+[m[32m        `).all([m
[32m+[m[32m            userId,[m
[32m+[m[32m            `-${Math.max([m
[32m+[m[32m                Number(days) || 30,[m
[32m+[m[32m                1[m
[32m+[m[32m            ) - 1} days`[m
[32m+[m[32m        );[m
[32m+[m
[32m+[m
[32m+[m[32m    return rows.map([m
[32m+[m[32m        row => ({[m
[32m+[m
[32m+[m[32m            date:[m
[32m+[m[32m                row.date,[m
 [m
[31m-        date:[m
[31m-            row.date,[m
[32m+[m[32m            inventoryId:[m
[32m+[m[32m                row.inventoryId !== null[m
[32m+[m[32m                    ? Number([m
[32m+[m[32m                        row.inventoryId[m
[32m+[m[32m                    )[m
[32m+[m[32m                    : null,[m
 [m
[31m-        expenses:[m
[31m-            Number(row.expenses) || 0[m
[32m+[m[32m            productName:[m
[32m+[m[32m                row.productName ||[m
[32m+[m[32m                "Unknown Product",[m
 [m
[31m-    }));[m
[32m+[m[32m            unitsSold:[m
[32m+[m[32m                Number([m
[32m+[m[32m                    row.unitsSold[m
[32m+[m[32m                ) || 0[m
[32m+[m
[32m+[m[32m        })[m
[32m+[m[32m    );[m
 [m
 }[m
 [m
 [m
[31m-// ==========================[m
[32m+[m[32m// ============================================================[m
 // EXPORT[m
[31m-// ==========================[m
[32m+[m[32m// ============================================================[m
[32m+[m
 module.exports = {[m
 [m
     getDailySales,[m
 [m
     getDailyProfit,[m
 [m
[31m-    getDailyExpenses[m
[32m+[m[32m    getDailyExpenses,[m
[32m+[m
[32m+[m[32m    getProductDailyDemand[m
 [m
 };[m
\ No newline at end of file[m
