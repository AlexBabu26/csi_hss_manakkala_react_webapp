"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
async function migrate() {
    try {
        console.log('Starting database migration...');
        // Read the schema.sql file
        const schemaPath = path_1.default.join(__dirname, 'schema.sql');
        const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
        // Execute the SQL
        await index_1.pool.query(schemaSql);
        console.log('Migration completed successfully.');
    }
    catch (err) {
        console.error('Error during migration:', err);
        process.exit(1);
    }
    finally {
        await index_1.pool.end();
    }
}
migrate();
