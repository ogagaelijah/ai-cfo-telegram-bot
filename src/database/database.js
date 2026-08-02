const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const config = require("../config/config");

// Project root
const rootPath = path.join(__dirname, "..", "..");

// Data folder
const dataFolder = path.join(rootPath, "data");

// Create data folder if it doesn't exist
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

// Database path
const dbPath = path.join(dataFolder, config.databaseName);

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

module.exports = db;