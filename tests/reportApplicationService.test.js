const {
    describe,
    it,
    expect,
    vi
} = await import("vitest");

// ============================================================
// APPLICATION SERVICE
// ============================================================

const {
    getExecutiveReportForUser
} = require(
    "../src/application/reportApplicationService"
);


// ============================================================
// TEST SUITE
// ============================================================

describe(
    "Report Application Service",
    () => {

        // ==================================================
        // DELEGATION
        // ==================================================

        it(
            "should request the executive report for a user",
            () => {

                const expectedReport = {

                    dashboard: {

                        revenue:
                            100000

                    },

                    health: {

                        status:
                            "Healthy"

                    }

                };


                const getExecutiveReportMock =
                    vi.fn()
                        .mockReturnValue(
                            expectedReport
                        );


                const reportService = {

                    getExecutiveReport:
                        getExecutiveReportMock

                };


                const result =
                    getExecutiveReportForUser(
                        999999,
                        reportService
                    );


                expect(
                    getExecutiveReportMock
                ).toHaveBeenCalledTimes(
                    1
                );


                expect(
                    getExecutiveReportMock
                ).toHaveBeenCalledWith(
                    999999
                );


                expect(
                    result
                ).toBe(
                    expectedReport
                );

            }
        );


        // ==================================================
        // USER ID VALIDATION
        // ==================================================

        it(
            "should reject a missing user ID",
            () => {

                expect(
                    () =>
                        getExecutiveReportForUser()
                ).toThrow(
                    "User ID is required."
                );

            }
        );


        it(
            "should reject an empty user ID",
            () => {

                expect(
                    () =>
                        getExecutiveReportForUser("")
                ).toThrow(
                    "User ID is required."
                );

            }
        );


        // ==================================================
        // INVALID SERVICE
        // ==================================================

        it(
            "should reject an invalid report service",
            () => {

                expect(
                    () =>
                        getExecutiveReportForUser(
                            999999,
                            {}
                        )
                ).toThrow(
                    "Executive report service is required."
                );

            }
        );

    }
);