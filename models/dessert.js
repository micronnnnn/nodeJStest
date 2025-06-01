const { sequelize } = require('../config/database'); // 路徑依照實際位置修改
const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

const Dessert = sequelize.define('Dessert', {
  dessert_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'DESSERT_ID',
  },
  dessert_preserve_date: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
    field: 'DESSERT_DATE',
  },
  dessert_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 2,
    },
    field: 'DESSERT_TYPE_ID',
  },
  dessert_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[\u4e00-\u9fa5a-zA-Z]+$/i, // 中文+英文字母正則
    },
    field: 'DESSERT_NAME',
  },
  dessert_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
    field: 'DESSERT_PRICE',
  },
  dessert_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
    field: 'DESSERT_AMOUNT',
  },
  dessert_instruction: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    field: 'DESSERT_INSTRUCTION',
  },
  dessert_total_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'TKT_TOTAL_SCORE',
  },
  dessert_total_people: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'TKT_TOTAL_PEOPLE',
  },
  dessert_pic: {
    type: DataTypes.STRING,
    allowNull: false,
    // 你可以自訂一個 validator 來驗證圖片格式
    field: 'DESSERT_IMG',
  },
}, {
  tableName: 'dessert',  // 資料表名稱
  timestamps: false,      // 如果資料表沒有 createdAt, updatedAt
});

module.exports = Dessert;
