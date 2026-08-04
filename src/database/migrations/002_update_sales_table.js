module.exports = {

    id: 2,

    name: "Update Sales Table",

    up(db) {

        // Get existing columns
        const columns = db.prepare(`
            PRAGMA table_info(sales)
        `).all();

        const existingColumns = columns.map(column => column.name);

        // Helper function
        function addColumn(name, sql) {

            if (existingColumns.includes(name)) {

                console.log(`✓ Column '${name}' already exists.`);

                return;

            }

            db.prepare(sql).run();

            console.log(`✅ Added column '${name}'.`);

        }

        // ==========================
        // INVENTORY ID
        // ==========================
        addColumn(

            "inventory_id",

            `
            ALTER TABLE sales
            ADD COLUMN inventory_id INTEGER
            `

        );

        // ==========================
        // COST PRICE
        // ==========================
        addColumn(

            "cost_price",

            `
            ALTER TABLE sales
            ADD COLUMN cost_price REAL DEFAULT 0
            `

        );

        // ==========================
        // REVENUE
        // ==========================
        addColumn(

            "revenue",

            `
            ALTER TABLE sales
            ADD COLUMN revenue REAL DEFAULT 0
            `

        );

        // ==========================
        // COST OF GOODS SOLD
        // ==========================
        addColumn(

            "cost_of_goods",

            `
            ALTER TABLE sales
            ADD COLUMN cost_of_goods REAL DEFAULT 0
            `

        );

        // ==========================
        // PROFIT
        // ==========================
        addColumn(

            "profit",

            `
            ALTER TABLE sales
            ADD COLUMN profit REAL DEFAULT 0
            `

        );

    }

};