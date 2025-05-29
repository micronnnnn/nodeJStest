const { sequelize } = require('../config/database'); // 路徑依照實際位置修改
const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

const PromoteList = sequelize.define('PromoteList', {
  promoListId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'PROMOTELIST_DATE_ID',
  },
  promoStartDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'PROMOTESTART_DATE',
  },
  promoEndDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'PROMOTEEND_DATE',
  },
  promoInstruction: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'PROMOTE_INSTRUCTION',
  },
}, {
  tableName: 'PROMTELIST_DATE',  // 資料表名稱
  timestamps: false,      // 如果資料表沒有 createdAt, updatedAt
});

module.exports = PromoteList;
