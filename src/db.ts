import mysql from 'mysql2/promise'

let connection: mysql.Connection

async function connectToDatabase() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'db',
            user: process.env.DB_USER || 'user',
            password: process.env.DB_PASSWORD || 'pass',
            database: process.env.DB_NAME || 'sql-ai',
            port: Number.parseInt(process.env.DB_PORT || '3306')
        }) 
    }
    return connection
}

export async function query(sql: string, params: any[] = []) {
    const connection = await connectToDatabase()
    const [results] = await connection.execute(sql, params)
    return results
}
