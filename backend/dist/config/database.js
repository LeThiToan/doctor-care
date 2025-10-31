"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "medbooking",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Export hàm query
async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}
//# sourceMappingURL=database.js.map