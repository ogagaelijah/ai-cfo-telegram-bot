const {
    describe,
    it,
    expect
} = await import("vitest");

const {
    INTENTS,
    getAdvisorIntent
} = await import(
    "../src/services/intelligence/advisorIntentService"
);


// ============================================================
// ADVISOR INTENT SERVICE TESTS
// ============================================================
//
// The intent service is rule-based.
//
// These tests verify:
//
// 1. Empty questions
// 2. Scenario detection
// 3. Cash detection
// 4. Inventory detection
// 5. Profit detection
// 6. Revenue detection
// 7. Risk detection
// 8. Decision detection
// 9. Overview detection
// 10. Help detection
// 11. Unknown questions
// 12. Case normalization
// 13. Whitespace normalization
// 14. Intent priority
//
// ============================================================


describe(
    "Advisor Intent Service",
    () => {


        // ====================================================
        // EMPTY QUESTIONS
        // ====================================================

        describe(
            "Empty Questions",
            () => {

                it(
                    "should return unknown for an empty question",
                    () => {

                        const result =
                            getAdvisorIntent("");

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.UNKNOWN
                        );

                        expect(
                            result.confidence
                        ).toBe(0);

                        expect(
                            result.question
                        ).toBe("");

                    }
                );


                it(
                    "should return unknown for null",
                    () => {

                        const result =
                            getAdvisorIntent(null);

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.UNKNOWN
                        );

                        expect(
                            result.confidence
                        ).toBe(0);

                    }
                );


                it(
                    "should return unknown for undefined",
                    () => {

                        const result =
                            getAdvisorIntent(
                                undefined
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.UNKNOWN
                        );

                        expect(
                            result.confidence
                        ).toBe(0);

                    }
                );


                it(
                    "should normalize whitespace-only questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "   "
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.UNKNOWN
                        );

                        expect(
                            result.confidence
                        ).toBe(0);

                        expect(
                            result.question
                        ).toBe("");

                    }
                );

            }
        );


        // ====================================================
        // SCENARIO
        // ====================================================

        describe(
            "Scenario Intent",
            () => {

                it(
                    "should detect a what-if question",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What if sales fall by 20%?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.SCENARIO
                        );

                        expect(
                            result.confidence
                        ).toBe(0.95);

                    }
                );


                it(
                    "should detect scenario keyword",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Run a scenario for revenue."
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.SCENARIO
                        );

                    }
                );


                it(
                    "should prioritize scenario over revenue",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What happens if revenue decreases by 15%?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.SCENARIO
                        );

                    }
                );

            }
        );


        // ====================================================
        // CASH
        // ====================================================

        describe(
            "Cash Intent",
            () => {

                it(
                    "should detect cash questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "How is my cash flow?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.CASH
                        );

                        expect(
                            result.confidence
                        ).toBe(0.95);

                    }
                );


                it(
                    "should detect liquidity questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Do I have enough liquidity?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.CASH
                        );

                    }
                );


                it(
                    "should detect cash balance questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What is my current cash balance?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.CASH
                        );

                    }
                );

            }
        );


        // ====================================================
        // INVENTORY
        // ====================================================

        describe(
            "Inventory Intent",
            () => {

                it(
                    "should detect inventory questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "How is my inventory?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.INVENTORY
                        );

                        expect(
                            result.confidence
                        ).toBe(0.95);

                    }
                );


                it(
                    "should detect stock questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Which stock needs attention?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.INVENTORY
                        );

                    }
                );


                it(
                    "should detect reorder questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Which products should I reorder?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.INVENTORY
                        );

                    }
                );

            }
        );


        // ====================================================
        // PROFIT
        // ====================================================

        describe(
            "Profit Intent",
            () => {

                it(
                    "should detect profit questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "How much profit will I make?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.PROFIT
                        );

                        expect(
                            result.confidence
                        ).toBe(0.95);

                    }
                );


                it(
                    "should detect margin questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What is my profit margin?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.PROFIT
                        );

                    }
                );


                it(
                    "should detect break-even questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "When will I break even?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.PROFIT
                        );

                    }
                );

            }
        );


        // ====================================================
        // REVENUE
        // ====================================================

        describe(
            "Revenue Intent",
            () => {

                it(
                    "should detect revenue questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What is my revenue forecast?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.REVENUE
                        );

                        expect(
                            result.confidence
                        ).toBe(0.95);

                    }
                );


                it(
                    "should detect sales questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "How are my sales performing?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.REVENUE
                        );

                    }
                );


                it(
                    "should detect turnover questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What is my business turnover?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.REVENUE
                        );

                    }
                );

            }
        );


        // ====================================================
        // RISK
        // ====================================================

        describe(
            "Risk Intent",
            () => {

                it(
                    "should detect risk questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What are my biggest risks?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.RISKS
                        );

                        expect(
                            result.confidence
                        ).toBe(0.90);

                    }
                );


                it(
                    "should detect concern questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What should I be concerned about?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.RISKS
                        );

                    }
                );


                it(
                    "should detect business problems",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What problems does my business have?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.RISKS
                        );

                    }
                );

            }
        );


        // ====================================================
        // DECISIONS
        // ====================================================

        describe(
            "Decision Intent",
            () => {

                it(
                    "should detect what should I do questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What should I do?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.DECISIONS
                        );

                        expect(
                            result.confidence
                        ).toBe(0.90);

                    }
                );


                it(
                    "should detect priority questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What should I prioritize?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.DECISIONS
                        );

                    }
                );


                it(
                    "should detect recommendation questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What recommendations do you have?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.DECISIONS
                        );

                    }
                );


                it(
                    "should detect next-step questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What are my next steps?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.DECISIONS
                        );

                    }
                );

            }
        );


        // ====================================================
        // OVERVIEW
        // ====================================================

        describe(
            "Overview Intent",
            () => {

                it(
                    "should detect business overview questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "How is my business doing?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.OVERVIEW
                        );

                        expect(
                            result.confidence
                        ).toBe(0.90);

                    }
                );


                it(
                    "should detect summary questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Give me a summary."
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.OVERVIEW
                        );

                    }
                );


                it(
                    "should detect overall performance questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What is my overall performance?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.OVERVIEW
                        );

                    }
                );

            }
        );


        // ====================================================
        // HELP
        // ====================================================

        describe(
            "Help Intent",
            () => {

                it(
                    "should detect help questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Help"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.HELP
                        );

                        expect(
                            result.confidence
                        ).toBe(0.90);

                    }
                );


                it(
                    "should detect capability questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What can you do?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.HELP
                        );

                    }
                );


                it(
                    "should detect command questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What commands can I use?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.HELP
                        );

                    }
                );

            }
        );


        // ====================================================
        // UNKNOWN
        // ====================================================

        describe(
            "Unknown Intent",
            () => {

                it(
                    "should return unknown for unrelated questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What is the weather today?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.UNKNOWN
                        );

                        expect(
                            result.confidence
                        ).toBe(0.20);

                    }
                );


                it(
                    "should return unknown for random text",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "Tell me something interesting."
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.UNKNOWN
                        );

                    }
                );

            }
        );


        // ====================================================
        // NORMALIZATION
        // ====================================================

        describe(
            "Question Normalization",
            () => {

                it(
                    "should normalize uppercase questions",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "WHAT IS MY REVENUE?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.REVENUE
                        );

                        expect(
                            result.question
                        ).toBe(
                            "what is my revenue?"
                        );

                    }
                );


                it(
                    "should trim leading and trailing whitespace",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "   How is my cash flow?   "
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.CASH
                        );

                        expect(
                            result.question
                        ).toBe(
                            "how is my cash flow?"
                        );

                    }
                );

            }
        );


        // ====================================================
        // INTENT PRIORITY
        // ====================================================

        describe(
            "Intent Priority",
            () => {

                it(
                    "should prioritize scenario over cash",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What happens if cash falls by 20%?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.SCENARIO
                        );

                    }
                );


                it(
                    "should prioritize scenario over inventory",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What if inventory decreases by 20%?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.SCENARIO
                        );

                    }
                );


                it(
                    "should prioritize scenario over profit",
                    () => {

                        const result =
                            getAdvisorIntent(
                                "What if profit decreases by 10%?"
                            );

                        expect(
                            result.intent
                        ).toBe(
                            INTENTS.SCENARIO
                        );

                    }
                );

            }
        );

    }
);