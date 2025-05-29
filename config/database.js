const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mitactest', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 30000
  },
  pool: {
    max: 50,
    min: 10,
    acquire: 30000,
    idle: 600000
  }
});

async function connectWithRetry(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ 資料庫連線成功！');
      return sequelize;
    } catch (err) {
      console.error(`❌ 第 ${i + 1} 次連線失敗：`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ 等待 ${delay / 1000} 秒後重試...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('🚫 已達最大重試次數，無法連線資料庫。');
        throw err;
      }
    }
  }
}

connectWithRetry();

module.exports = {
  sequelize,
  connectWithRetry
};
