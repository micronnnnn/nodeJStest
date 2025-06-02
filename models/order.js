const { sequelize } = require('../config/database'); // 路徑依照實際位置修改
const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

const dessertOrder = sequelize.define('dessertOrder', {
  dessertOrderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'DESSERT_ORDER_ID',
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'ORDER_DATE',
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'TOTAL',
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'CUSTOMER_NAME',
  },
    customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'CUSTOMER_PHONE',
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'CUSTOMER_EMAIL',
  },
  customerAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'CUSTOMER_ADDRESS',
  },
}, {
  tableName: 'dessert_order',  // 資料表名稱
  timestamps: false,      // 如果資料表沒有 createdAt, updatedAt
});

module.exports = dessertOrder;
