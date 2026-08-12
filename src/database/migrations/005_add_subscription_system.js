module.exports = {

    id: 5,

    name: "Add Subscription System",

    up(db) {

        // ==================================================
        // SUBSCRIPTION PLANS
        // ==================================================
        //
        // Plans are global.
        //
        // Examples:
        //
        // FREE
        // PRO
        // BUSINESS
        //
        // An account subscribes to a plan.
        //
        // ==================================================

        db.prepare(`
            CREATE TABLE IF NOT EXISTS subscription_plans (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                code TEXT NOT NULL UNIQUE,

                name TEXT NOT NULL,

                description TEXT,

                price REAL NOT NULL DEFAULT 0,

                currency TEXT NOT NULL DEFAULT 'NGN',

                billing_interval TEXT NOT NULL
                    DEFAULT 'MONTHLY',

                is_active INTEGER NOT NULL
                    DEFAULT 1,

                created_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                updated_at TEXT
                    DEFAULT CURRENT_TIMESTAMP
            )
        `).run();


        // ==================================================
        // ACCOUNT SUBSCRIPTIONS
        // ==================================================
        //
        // IMPORTANT:
        //
        // Subscription belongs to ACCOUNT.
        //
        // NOT USER.
        //
        // This prevents one user from subscribing once
        // and then giving every account they create
        // access to the same paid features.
        //
        // ==================================================

        db.prepare(`
            CREATE TABLE IF NOT EXISTS subscriptions (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                account_id INTEGER NOT NULL,

                plan_id INTEGER NOT NULL,

                status TEXT NOT NULL
                    DEFAULT 'ACTIVE',

                started_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                expires_at TEXT,

                trial_ends_at TEXT,

                cancelled_at TEXT,

                payment_reference TEXT,

                created_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                updated_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY(account_id)
                    REFERENCES accounts(id),

                FOREIGN KEY(plan_id)
                    REFERENCES subscription_plans(id)
            )
        `).run();


        // ==================================================
        // PLAN FEATURES
        // ==================================================
        //
        // This allows features to be controlled by data
        // instead of hard-coding plan logic throughout
        // the application.
        //
        // Example:
        //
        // PRO
        //   AI_INSIGHTS
        //   FORECASTING
        //
        // BUSINESS
        //   AI_ADVISOR
        //   DECISION_ENGINE
        //
        // ==================================================

        db.prepare(`
            CREATE TABLE IF NOT EXISTS plan_features (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                plan_id INTEGER NOT NULL,

                feature_code TEXT NOT NULL,

                enabled INTEGER NOT NULL
                    DEFAULT 1,

                limit_value INTEGER,

                created_at TEXT
                    DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY(plan_id)
                    REFERENCES subscription_plans(id),

                UNIQUE(
                    plan_id,
                    feature_code
                )
            )
        `).run();


        // ==================================================
        // INDEXES
        // ==================================================

        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_subscriptions_account

            ON subscriptions(account_id)
        `).run();


        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_subscriptions_plan

            ON subscriptions(plan_id)
        `).run();


        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_subscriptions_status

            ON subscriptions(status)
        `).run();


        db.prepare(`
            CREATE INDEX IF NOT EXISTS
            idx_plan_features_plan

            ON plan_features(plan_id)
        `).run();


        // ==================================================
        // INSERT DEFAULT PLANS
        // ==================================================
        //
        // These are the initial SaaS plans.
        //
        // Pricing can be changed later.
        //
        // ==================================================

        db.prepare(`
            INSERT OR IGNORE INTO subscription_plans
            (
                code,
                name,
                description,
                price,
                currency,
                billing_interval,
                is_active
            )

            VALUES
            (
                'FREE',
                'Free',
                'Basic access to the AI CFO.',
                0,
                'NGN',
                'MONTHLY',
                1
            )
        `).run();


        db.prepare(`
            INSERT OR IGNORE INTO subscription_plans
            (
                code,
                name,
                description,
                price,
                currency,
                billing_interval,
                is_active
            )

            VALUES
            (
                'PRO',
                'Pro',
                'Advanced financial management and intelligence.',
                0,
                'NGN',
                'MONTHLY',
                1
            )
        `).run();


        db.prepare(`
            INSERT OR IGNORE INTO subscription_plans
            (
                code,
                name,
                description,
                price,
                currency,
                billing_interval,
                is_active
            )

            VALUES
            (
                'BUSINESS',
                'Business',
                'Advanced AI CFO capabilities for growing businesses.',
                0,
                'NGN',
                'MONTHLY',
                1
            )
        `).run();


        console.log(
            "✅ Subscription system initialized."
        );

    }

};