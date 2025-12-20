import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root", 
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "medbooking",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Enable SSL for Azure MySQL or Aiven (if DB_SSL is set to 'true')
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false // Azure and Aiven use self-signed certificates
    } : undefined
})

// Export hàm query
export async function query(sql: string, params?: any[]) {
    const [rows] = await pool.execute(sql, params)
    return rows
}
