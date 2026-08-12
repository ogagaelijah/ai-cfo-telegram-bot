const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const {
    getExecutiveReport
} = require("./executiveReportService");


// ============================================================
// EXCEL EXPORT SERVICE
// ============================================================
//
// Interface-agnostic Excel export layer.
//
// This service:
// - Gets the canonical Executive Report
// - Does NOT calculate financial values
// - Does NOT contain Telegram logic
// - Can later be used by:
//      Telegram
//      Website
//      Mobile App
//
// Telegram only receives the generated file.
// ============================================================


// ============================================================
// HELPERS
// ============================================================

function isObject(value) {

    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}


function formatValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    if (
        typeof value === "object"
    ) {

        return JSON.stringify(
            value
        );
    }


    return value;
}


function formatHeader(
    value
) {

    return String(value)
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2"
        )
        .replace(
            /_/g,
            " "
        )
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


// ============================================================
// STYLE WORKSHEET
// ============================================================

function styleWorksheet(
    worksheet
) {

    worksheet.columns.forEach(
        column => {

            let maxLength = 12;


            column.eachCell(
                {
                    includeEmpty: false
                },
                cell => {

                    const value =
                        String(
                            cell.value ?? ""
                        );


                    maxLength =
                        Math.max(
                            maxLength,
                            value.length + 2
                        );

                }
            );


            column.width =
                Math.min(
                    maxLength,
                    45
                );

        }
    );


    worksheet.eachRow(
        row => {

            row.eachCell(
                cell => {

                    cell.alignment = {

                        vertical:
                            "top",

                        wrapText:
                            true

                    };

                }
            );

        }
    );


    worksheet.views = [

        {
            state:
                "frozen",

            ySplit:
                1

        }

    ];

}


// ============================================================
// ADD KEY/VALUE SECTION
// ============================================================

function addKeyValueSection(
    workbook,
    name,
    data
) {

    const worksheet =
        workbook.addWorksheet(
            name
        );


    worksheet.addRow([
        "Field",
        "Value"
    ]);


    const header =
        worksheet.getRow(1);


    header.font = {

        bold: true

    };


    header.alignment = {

        horizontal:
            "center",

        vertical:
            "middle"

    };


    Object.entries(
        data || {}
    ).forEach(
        ([key, value]) => {

            worksheet.addRow([

                formatHeader(key),

                formatValue(value)

            ]);

        }
    );


    styleWorksheet(
        worksheet
    );


    return worksheet;
}


// ============================================================
// ADD ARRAY SECTION
// ============================================================

function addArraySection(
    workbook,
    name,
    data
) {

    const worksheet =
        workbook.addWorksheet(
            name
        );


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        worksheet.addRow([
            "No data available"
        ]);


        styleWorksheet(
            worksheet
        );


        return worksheet;
    }


    // --------------------------------------------------------
    // OBJECT ARRAY
    // --------------------------------------------------------

    if (
        data.every(
            item =>
                isObject(item)
        )
    ) {

        const keys = [

            ...new Set(

                data.flatMap(
                    item =>
                        Object.keys(
                            item
                        )
                )

            )

        ];


        worksheet.addRow(
            keys.map(
                key =>
                    formatHeader(key)
            )
        );


        worksheet.getRow(1).font = {

            bold: true

        };


        data.forEach(
            item => {

                worksheet.addRow(

                    keys.map(
                        key =>
                            formatValue(
                                item[key]
                            )
                    )

                );

            }
        );

    }

    // --------------------------------------------------------
    // SIMPLE VALUE ARRAY
    // --------------------------------------------------------

    else {

        worksheet.addRow([
            "Value"
        ]);


        worksheet.getRow(1).font = {

            bold: true

        };


        data.forEach(
            value => {

                worksheet.addRow([

                    formatValue(value)

                ]);

            }
        );

    }


    styleWorksheet(
        worksheet
    );


    return worksheet;
}


// ============================================================
// ADD REPORT SECTION
// ============================================================
//
// Automatically chooses the correct worksheet structure
// based on the section's data type.
//
// This keeps the exporter resilient when the Executive Report
// grows in the future.
// ============================================================

function addReportSection(
    workbook,
    sectionName,
    data
) {

    const safeName =
        String(sectionName)
            .substring(
                0,
                31
            );


    if (
        Array.isArray(data)
    ) {

        return addArraySection(
            workbook,
            safeName,
            data
        );

    }


    if (
        isObject(data)
    ) {

        return addKeyValueSection(
            workbook,
            safeName,
            data
        );

    }


    return addKeyValueSection(
        workbook,
        safeName,
        {
            value:
                data
        }
    );

}


// ============================================================
// EXPORT EXECUTIVE REPORT TO EXCEL
// ============================================================

async function exportExecutiveReportToExcel(
    telegramId
) {

    // ========================================================
    // GET CANONICAL EXECUTIVE REPORT
    // ========================================================

    const report =
        getExecutiveReport(
            telegramId
        );


    if (
        !report ||
        typeof report !== "object"
    ) {

        throw new Error(
            "Executive Report is unavailable."
        );

    }


    // ========================================================
    // CREATE WORKBOOK
    // ========================================================

    const workbook =
        new ExcelJS.Workbook();


    workbook.creator =
        "AI CFO";


    workbook.lastModifiedBy =
        "AI CFO";


    workbook.created =
        new Date();


    workbook.modified =
        new Date();


    workbook.properties = {

        title:
            "AI CFO Executive Financial Report",

        subject:
            "Executive Financial Intelligence",

        company:
            "AI CFO"

    };


    // ========================================================
    // EXECUTIVE SUMMARY
    // ========================================================

    const summary =
        report.executiveSummary || {};


    const summarySheet =
        workbook.addWorksheet(
            "Executive Summary"
        );


    summarySheet.addRow([
        "AI CFO EXECUTIVE FINANCIAL REPORT"
    ]);


    summarySheet.mergeCells(
        "A1:B1"
    );


    summarySheet.getCell(
        "A1"
    ).font = {

        bold: true,

        size: 16

    };


    summarySheet.addRow([]);


    summarySheet.addRow([
        "Headline",
        formatValue(
            summary.headline
        )
    ]);


    summarySheet.addRow([
        "Message",
        formatValue(
            summary.message
        )
    ]);


    summarySheet.addRow([
        "Status",
        formatValue(
            summary.status
        )
    ]);


    summarySheet.addRow([
        "Top Priority",
        formatValue(
            summary.topPriority
        )
    ]);


    summarySheet.addRow([]);


    summarySheet.addRow([
        "Generated",
        new Date()
    ]);


    summarySheet.getColumn(
        1
    ).width = 25;


    summarySheet.getColumn(
        2
    ).width = 70;


    summarySheet.getRow(1).height =
        28;


    summarySheet.eachRow(
        row => {

            row.eachCell(
                cell => {

                    cell.alignment = {

                        vertical:
                            "top",

                        wrapText:
                            true

                    };

                }
            );

        }
    );


    // ========================================================
    // CORE REPORT SECTIONS
    // ========================================================

    const sections = {

        Dashboard:
            report.dashboard,

        Health:
            report.health,

        KPIs:
            report.kpis,

        Trends:
            report.trends,

        Forecast:
            report.forecast,

        Insights:
            report.insights,

        ProfitLoss:
            report.profitLoss,

        CashFlow:
            report.cashFlow,

        Advisor:
            report.advisor,

        Decisions:
            report.decisions,

        Recommendations:
            report.recommendations,

        Risks:
            report.risks

    };


    Object.entries(
        sections
    ).forEach(
        ([name, data]) => {

            addReportSection(
                workbook,
                name,
                data
            );

        }
    );


    // ========================================================
    // OUTPUT DIRECTORY
    // ========================================================

    const outputDirectory =
        path.join(
            process.cwd(),
            "exports"
        );


    if (
        !fs.existsSync(
            outputDirectory
        )
    ) {

        fs.mkdirSync(
            outputDirectory,
            {
                recursive: true
            }
        );

    }


    // ========================================================
    // FILE NAME
    // ========================================================

    const identifier =
        String(
            telegramId
        ).replace(
            /[^a-zA-Z0-9_-]/g,
            "_"
        );


    const filePath =
        path.join(

            outputDirectory,

            `executive-report-${identifier}-${Date.now()}.xlsx`

        );


    // ========================================================
    // WRITE WORKBOOK
    // ========================================================

    await workbook.xlsx.writeFile(
        filePath
    );


    // ========================================================
    // VERIFY FILE
    // ========================================================

    if (
        !fs.existsSync(
            filePath
        )
    ) {

        throw new Error(
            "Excel report file was not created."
        );

    }


    console.log(
        "📊 Excel report generated:",
        filePath
    );


    return filePath;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    exportExecutiveReportToExcel

};