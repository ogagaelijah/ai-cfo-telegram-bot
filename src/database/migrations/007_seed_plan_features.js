module.exports = {

    id: 7,

    name: "Seed Subscription Plan Features",

    up(db) {

        // ==================================================
        // FEATURE MATRIX
        // ==================================================
        //
        // FREE
        // ----
        // Designed for onboarding and product discovery.
        // Users can actually use the CFO, but limits create
        // a natural upgrade path.
        //
        // PRO
        // ---
        // Full financial management + advanced intelligence.
        //
        // BUSINESS
        // --------
        // Full CFO intelligence + executive capabilities.
        //
        // limit_value:
        //
        //   NULL = unlimited
        //
        //   number = maximum allowed usage for the
        //            applicable usage period.
        //
        // ==================================================

        const features = {

            FREE: [

                // ------------------------------------------
                // CORE DATA ENTRY
                // ------------------------------------------

                {
                    code: "SALES",
                    limit: 20
                },

                {
                    code: "EXPENSES",
                    limit: 20
                },

                {
                    code: "INCOME",
                    limit: 20
                },

                {
                    code: "CUSTOMERS",
                    limit: 10
                },

                // ------------------------------------------
                // BASIC REPORTING
                // ------------------------------------------

                {
                    code: "REPORTS",
                    limit: 1
                }

            ],


            PRO: [

                // ------------------------------------------
                // CORE FINANCIAL MANAGEMENT
                // ------------------------------------------

                "SALES",
                "EXPENSES",
                "INCOME",
                "INVENTORY",
                "CUSTOMERS",
                "SUPPLIERS",
                "DEBTORS",
                "CREDITORS",
                "PURCHASES",

                // ------------------------------------------
                // REPORTING
                // ------------------------------------------

                "REPORTS",
                "PROFIT_LOSS",
                "CASH_FLOW",
                "KPI_DASHBOARD",
                "BUSINESS_TRENDS",
                "FORECASTING",

                // ------------------------------------------
                // AI
                // ------------------------------------------

                "AI_INSIGHTS",
                "RECOMMENDATIONS",

                // ------------------------------------------
                // EXPORTS
                // ------------------------------------------

                "PDF_EXPORT",
                "EXCEL_EXPORT"

            ],


            BUSINESS: [

                // ------------------------------------------
                // EVERYTHING IN PRO
                // ------------------------------------------

                "SALES",
                "EXPENSES",
                "INCOME",
                "INVENTORY",
                "CUSTOMERS",
                "SUPPLIERS",
                "DEBTORS",
                "CREDITORS",
                "PURCHASES",

                "REPORTS",
                "PROFIT_LOSS",
                "CASH_FLOW",
                "KPI_DASHBOARD",
                "BUSINESS_TRENDS",
                "FORECASTING",

                "AI_INSIGHTS",
                "RECOMMENDATIONS",

                "PDF_EXPORT",
                "EXCEL_EXPORT",


                // ------------------------------------------
                // ADVANCED CFO INTELLIGENCE
                // ------------------------------------------

                "AI_ADVISOR",
                "DECISION_ENGINE",
                "RISK_INTELLIGENCE",

                // ------------------------------------------
                // EXECUTIVE MANAGEMENT
                // ------------------------------------------

                "EXECUTIVE_DASHBOARD",
                "EXECUTIVE_REPORT"

            ]

        };


        // ==================================================
        // INSERT FEATURE
        // ==================================================

        const insertFeature =
            db.prepare(`
                INSERT OR IGNORE INTO plan_features
                (
                    plan_id,
                    feature_code,
                    enabled,
                    limit_value
                )
                VALUES
                (
                    ?,
                    ?,
                    1,
                    ?
                )
            `);


        // ==================================================
        // DISABLE FEATURE
        // ==================================================

        const disableFeature =
            db.prepare(`
                INSERT OR IGNORE INTO plan_features
                (
                    plan_id,
                    feature_code,
                    enabled,
                    limit_value
                )
                VALUES
                (
                    ?,
                    ?,
                    0,
                    NULL
                )
            `);


        // ==================================================
        // GET PLAN
        // ==================================================

        const getPlan =
            db.prepare(`
                SELECT id
                FROM subscription_plans
                WHERE code = ?
                LIMIT 1
            `);


        // ==================================================
        // ALL FEATURE CODES
        // ==================================================

        const allFeatures = [

            "SALES",
            "EXPENSES",
            "INCOME",
            "INVENTORY",
            "CUSTOMERS",
            "SUPPLIERS",
            "DEBTORS",
            "CREDITORS",
            "PURCHASES",

            "REPORTS",
            "PROFIT_LOSS",
            "CASH_FLOW",
            "KPI_DASHBOARD",
            "BUSINESS_TRENDS",
            "FORECASTING",

            "AI_INSIGHTS",
            "AI_ADVISOR",
            "DECISION_ENGINE",
            "RISK_INTELLIGENCE",
            "RECOMMENDATIONS",

            "EXECUTIVE_DASHBOARD",
            "EXECUTIVE_REPORT",

            "PDF_EXPORT",
            "EXCEL_EXPORT"

        ];


        // ==================================================
        // SEED PLANS
        // ==================================================

        const transaction =
            db.transaction(() => {

                for (
                    const planCode of Object.keys(features)
                ) {

                    const plan =
                        getPlan.get(planCode);


                    if (!plan) {

                        throw new Error(
                            `Subscription plan "${planCode}" does not exist.`
                        );

                    }


                    const configured =
                        features[planCode];


                    // --------------------------------------
                    // Normalize configuration
                    // --------------------------------------

                    const enabledFeatures =
                        new Map();


                    for (
                        const feature of configured
                    ) {

                        if (
                            typeof feature === "string"
                        ) {

                            enabledFeatures.set(
                                feature,
                                null
                            );

                        } else {

                            enabledFeatures.set(
                                feature.code,
                                feature.limit
                            );

                        }

                    }


                    // --------------------------------------
                    // Configure EVERY feature
                    // --------------------------------------

                    for (
                        const featureCode of allFeatures
                    ) {

                        if (
                            enabledFeatures.has(
                                featureCode
                            )
                        ) {

                            insertFeature.run(
                                plan.id,
                                featureCode,
                                enabledFeatures.get(
                                    featureCode
                                )
                            );

                        } else {

                            disableFeature.run(
                                plan.id,
                                featureCode
                            );

                        }

                    }

                }

            });


        transaction();


        console.log(
            "✅ Subscription plan features seeded successfully."
        );

    }

};