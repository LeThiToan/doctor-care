import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "",
    database: "medbooking",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// Export hàm query
export async function query(sql: string, params?: any[]) {
    const [rows] = await pool.execute(sql, params)
    return rows
}
