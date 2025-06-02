const { sequelize } = require('../config/database'); // 路徑依照實際位置修改
const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

const dessertOrderItem = sequelize.define('dessertOrderItem', {
  dessert_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'DESSERT_ID',
  },
  dessertOrderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'DESSERT_ORDER_ID',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'AMOUNT',
  },
  dessert_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'DESSERT_PRICE',
  },
    dessert_deadline: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'DESSERT_DEADLINE',
  },
}, {
  tableName: 'dessert_item',  // 資料表名稱
  timestamps: false,      // 如果資料表沒有 createdAt, updatedAt
});

module.exports = dessertOrderItem;
