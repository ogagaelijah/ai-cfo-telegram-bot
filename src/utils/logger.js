const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const logFile = path.join(logDirectory, "application.log");

function timestamp() {

    return new Date().toISOString();

}

function write(level, message) {

    const line =
        `[${timestamp()}] ${level}: ${message}\n`;

    fs.appendFileSync(logFile, line);

    console.log(line.trim());

}

function info(message) {

    write("INFO", message);

}

function warning(message) {

    write("WARNING", message);

}

function error(message) {

    write("ERROR", message);

}

module.exports = {

    info,
    warning,
    error

};