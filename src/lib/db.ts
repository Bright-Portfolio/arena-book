import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//test connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("database connection successfully");
    console.log("server time", result.rows[0].now);
    client.release();

    return true;
  } catch (error) {
    console.error("database connection failed:", error);

    return false;
  }
}

export default pool;
