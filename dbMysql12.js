// mysql12.js
const mysql = require('mysql2/promise');

// 建立資料庫連線池（請依實際環境修改 host/user/password/database）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mitactest',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 查詢 dessert 資料表，並回傳類似 Spring Boot 的 JSONArray 結構
async function getAllDessert() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM dessert');
    console.log('test', rows[0]);
    return rows.map(row => ({
      dessert_id: row.DESSERT_ID,
      dessert_preserve_date: row.DESSERT_ID,
      dessert_type_id: row.DESSERT_TYPE_ID,
      dessert_name: row.DESSERT_NAME,
      dessert_price: row.DESSERT_PRICE,
      dessert_amount: row.DESSERT_AMOUNT,
      dessert_instruction: row.DESSERT_INSTRUCTION,
      dessert_total_score: row.TKT_TOTAL_SCORE,
      dessert_total_people: row.TKT_TOTAL_PEOPLE
    }));
  } catch (err) {
    console.error('查詢錯誤:', err);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { getAllDessert };

