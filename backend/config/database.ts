import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "medbooking",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// Export hàm query
export async function query(sql: string, params?: any[]) {
    const [rows] = await pool.execute(sql, params)
    return rows
}
