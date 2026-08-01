const Database = require("better-sqlite3");
const path = require("path");
const config = require("../config/config");

// Database will be stored inside the data folder
const dbPath = path.join(__dirname, "..", "data", config.databaseName);

// Create database connection
const db = new Database(dbPath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

module.exports = db;