module.exports = {

    id: 4,

    name: "Add Account Type",

    up(db) {

        // ==================================================
        // CHECK EXISTING COLUMNS
        // ==================================================

        const columns = db.prepare(`
            PRAGMA table_info(accounts)
        `).all();

        const exists =
            columns.some(
                column =>
                    column.name === "account_type"
            );


        // ==================================================
        // ADD ACCOUNT TYPE
        // ==================================================

        if (!exists) {

            db.prepare(`
                ALTER TABLE accounts
                ADD COLUMN account_type
                TEXT NOT NULL
                DEFAULT 'BUSINESS'
            `).run();

            console.log(
                "✅ Added account_type to accounts."
            );

        } else {

            console.log(
                "✓ Column 'account_type' already exists."
            );

        }


        // ==================================================
        // NORMALIZE EXISTING ACCOUNTS
        // ==================================================
        //
        // Every account created before this migration
        // is currently treated as a BUSINESS account.
        //
        // This preserves the existing CFO behavior.
        //

        db.prepare(`
            UPDATE accounts
            SET account_type = 'BUSINESS'
            WHERE account_type IS NULL
               OR TRIM(account_type) = ''
        `).run();


        // ==================================================
        // VALIDATE ACCOUNT TYPES
        // ==================================================
        //
        // SQLite cannot easily add a CHECK constraint to
        // an existing table without rebuilding it.
        //
        // Therefore validation will be handled by the
        // account service when new accounts are created.
        //

        console.log(
            "✅ Existing accounts classified as BUSINESS."
        );

    }

};