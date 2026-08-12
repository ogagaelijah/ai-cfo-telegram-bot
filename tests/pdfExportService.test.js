const {
    describe,
    it,
    expect,
    beforeEach,
    afterEach
} = await import("vitest");

const fs =
    await import("fs");

const path =
    await import("path");

const {
    exportExecutiveReportToPDF
} = await import(
    "../src/services/pdfExportService"
);


// ============================================================
// TEST DIRECTORY
// ============================================================

const testDirectory =
    path.join(
        process.cwd(),
        "exports",
        "test"
    );


// ============================================================
// TEST REPORT
// ============================================================

function createTestReport() {

    return {

        dashboard: {

            sales:
                1000000,

            netProfit:
                400000

        },

        health: {

            status:
                "Healthy",

            score:
                85

        },

        kpis: {

            grossMargin:
                60,

            netMargin:
                40,

            cashPosition:
                500000

        },

        trends: {

            daily: {

                growth:
                    5

            },

            weekly: {

                growth:
                    12

            },

            monthly: {

                growth:
                    18

            }

        },

        forecast: {

            next7DaysRevenue:
                700000,

            next30DaysRevenue:
                3000000,

            revenue: {

                tomorrow:
                    100000,

                next7Days:
                    700000,

                next30Days:
                    3000000,

                confidence:
                    80

            }

        },

        profitLoss: {

            grossProfit:
                600000,

            netProfit:
                400000

        },

        cashFlow: {

            openingCash:
                400000,

            closingCash:
                500000,

            netCashFlow:
                100000

        },

        risks: [

            {

                type:
                    "Cash Flow Risk",

                severity:
                    "Warning",

                message:
                    "Projected cash pressure."

            }

        ],

        decisions: [

            {

                title:
                    "Protect Cash Flow",

                priority:
                    "High",

                score:
                    85

            }

        ],

        recommendations: [

            {

                title:
                    "Reduce unnecessary expenses",

                priority:
                    "High",

                score:
                    90

            }

        ],

        advisor: {

            businessStatus:
                "Healthy",

            overallPriority:
                "High",

            confidence:
                80,

            headline:
                "Business is financially stable.",

            assessment:
                "Cash flow should be monitored.",

            keyIssues: [

                "Projected cash pressure"

            ],

            opportunities: [

                "Improve expense control"

            ]

        },

        executiveSummary: {

            headline:
                "Business is stable.",

            message:
                "Continue monitoring cash flow.",

            status:
                "Healthy",

            topPriority:
                "Protect Cash Flow"

        }

    };

}


// ============================================================
// EMPTY REPORT
// ============================================================

function createEmptyReport() {

    return {

        dashboard: {},

        health: {},

        kpis: {},

        trends: {},

        forecast: {},

        profitLoss: {},

        cashFlow: {},

        risks: [],

        decisions: [],

        recommendations: [],

        advisor: {},

        executiveSummary: {}

    };

}


// ============================================================
// REMOVE TEST FILE
// ============================================================

function removeTestFile(
    filePath
) {

    if (
        fs.existsSync(
            filePath
        )
    ) {

        fs.unlinkSync(
            filePath
        );

    }

}


// ============================================================
// TEST SUITE
// ============================================================

describe(
    "PDF Export Service",
    () => {

        beforeEach(
            () => {

                fs.mkdirSync(
                    testDirectory,
                    {
                        recursive:
                            true
                    }
                );

            }
        );


        afterEach(
            () => {

                removeTestFile(
                    path.join(
                        testDirectory,
                        "executive-report-test.pdf"
                    )
                );

                removeTestFile(
                    path.join(
                        testDirectory,
                        "empty-executive-report-test.pdf"
                    )
                );

            }
        );


        // ====================================================
        // VALID EXECUTIVE REPORT
        // ====================================================

        it(
            "should generate a valid PDF file",
            async () => {

                const report =
                    createTestReport();


                const outputPath =
                    path.join(
                        testDirectory,
                        "executive-report-test.pdf"
                    );


                const result =
                    await exportExecutiveReportToPDF(
                        report,
                        outputPath
                    );


                expect(
                    result
                ).toBe(
                    outputPath
                );


                expect(
                    fs.existsSync(
                        outputPath
                    )
                ).toBe(
                    true
                );


                const stats =
                    fs.statSync(
                        outputPath
                    );


                expect(
                    stats.size
                ).toBeGreaterThan(
                    1000
                );


                const pdfHeader =
                    fs.readFileSync(
                        outputPath,
                        {
                            encoding:
                                "latin1"
                        }
                    );


                expect(
                    pdfHeader.startsWith(
                        "%PDF"
                    )
                ).toBe(
                    true
                );

            }
        );


        // ====================================================
        // MISSING INTELLIGENCE
        // ====================================================

        it(
            "should safely handle missing intelligence",
            async () => {

                const report =
                    createEmptyReport();


                const outputPath =
                    path.join(
                        testDirectory,
                        "empty-executive-report-test.pdf"
                    );


                const result =
                    await exportExecutiveReportToPDF(
                        report,
                        outputPath
                    );


                expect(
                    result
                ).toBe(
                    outputPath
                );


                expect(
                    fs.existsSync(
                        outputPath
                    )
                ).toBe(
                    true
                );


                const stats =
                    fs.statSync(
                        outputPath
                    );


                expect(
                    stats.size
                ).toBeGreaterThan(
                    1000
                );


                const pdfHeader =
                    fs.readFileSync(
                        outputPath,
                        {
                            encoding:
                                "latin1"
                        }
                    );


                expect(
                    pdfHeader.startsWith(
                        "%PDF"
                    )
                ).toBe(
                    true
                );

            }
        );

    }
);