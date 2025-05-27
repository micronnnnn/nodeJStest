const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mitactest', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('資料庫連線成功！');
  })
  .catch(err => {
    console.error('資料庫連線失敗:', err);
});

module.exports = sequelize;
