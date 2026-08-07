// ==========================
// ALERT SUMMARY
// ==========================
function getAlertSummary(alerts = []) {

    const summary = {

        critical: 0,

        warning: 0,

        info: 0,

        topPriority: null,

        requiresAttention: false

    };

    alerts.forEach(alert => {

        switch (alert.level) {

            case "CRITICAL":

                summary.critical++;

                break;

            case "WARNING":

                summary.warning++;

                break;

            case "INFO":

                summary.info++;

                break;

        }

    });

    summary.topPriority = alerts[0] || null;

    summary.requiresAttention =
        summary.critical > 0 ||
        summary.warning > 0;

    return summary;

}

module.exports = {

    getAlertSummary

};