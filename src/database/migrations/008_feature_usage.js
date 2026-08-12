module.exports = {

    id: 8,

    name: "Add Feature Usage Tracking",

    up(db) {

        // ==================================================
        // FEATURE USAGE
        // ==================================================
        //
        // Tracks how many times an account has used a
        // limited feature during a billing period.
        //
        // Example:
        //
        // FREE REPORTS
        // Limit = 1
        //
        // Account uses Reports once:
        //
        // usage_count = 1
        //
        // Second attempt:
        //
        // LIMIT_REACHED
        //
        // Usage is account-based, not user-based.
        //
        // ==================================================

        db.prepare(`
            CREATE TABLE IF NOT EXISTS feature_usage (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                account_id INTEGER NOT NULL,

                feature_code TEXT NOT NULL,

                usage_count INTEGER NOT NULL DEFAULT 0,

                period_start TEXT NOT NULL,

                period_end TEXT NOT NULL,

                created_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                updated_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY(account_id)
                    REFERENCES accounts(id),

                UNIQUE(
                    account_id,
                    feature_code,
                    period_start
                )
            )
        `).run();


        // ==================================================
        // INDEXES
        // ==================================================

        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_feature_usage_account

            ON feature_usage(account_id)
        `).run();


        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_feature_usage_feature

            ON feature_usage(feature_code)
        `).run();


        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_feature_usage_period

            ON feature_usage(
                period_start,
                period_end
            )
        `).run();


        console.log(
            "✅ Feature usage tracking initialized."
        );
    }

};