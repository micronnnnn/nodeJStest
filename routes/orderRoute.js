const express = require('express');
const router = express.Router();
const dessertOrder = require('../models/order'); // 直接引入單一 Model
const dessertOrderItem = require('../models/orderItem'); // 直接引入單一 Model
const Dessert = require('../models/dessert'); // 直接引入單一 Model
const  { sendMail }  = require('../utility/mail'); // 直接引入單一 Model
const dayjs = require('dayjs');
const ExcelJS = require('exceljs');



//post // getorderdetailed
// 查詢指定訂單的明細
router.post('/getOrderDetailed', async (req, res) => {
  try {
    const orderId = req.body.order?.dessertOrderId;

    if (!orderId) {
      return res.status(400).json({ error: '缺少 order.dessert_order_id' });
    }

    // 查詢該訂單的所有甜點項目
    const orderItems = await dessertOrderItem.findAll({
      where: { dessertOrderId: orderId },
    });

    const result = [];

    for (const item of orderItems) {
      const dessert = await Dessert.findByPk(item.dessert_id); // 查 dessert name

      result.push({
        dessert_id: item.dessert_id,
        dessert_name: dessert?.dessert_name || '未知甜點',
        dessert_amout: item.amount,
        dessert_price: item.dessert_price,
        subtotal: item.amount * item.dessert_price,
        dessert_deadline: dayjs(item.dessert_deadline).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    res.json(result);
  } catch (err) {
    console.error('❌ 發生錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

//post//download
router.post('/download', async (req, res) => {
  try {
    // 建立工作簿與工作表
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('訂單明細');

    // 加入標題列
    worksheet.columns = [
      { header: '甜點名稱', key: 'dessert_name', width: 20 },
      { header: '數量', key: 'dessert_amout', width: 10 },
      { header: '單價', key: 'dessert_price', width: 10 },
      { header: '小計', key: 'subtotal', width: 15 },
      { header: '保存期限', key: 'dessert_deadline', width: 20 }
    ];

const orderId = req.body.order?.dessertOrderId;

    if (!orderId) {
      return res.status(400).json({ error: '缺少 order.dessert_order_id' });
    }

    // 查詢該訂單的所有甜點項目
    const orderItems = await dessertOrderItem.findAll({
      where: { dessertOrderId: orderId },
    });

    const result = [];

    for (const item of orderItems) {
      const dessert = await Dessert.findByPk(item.dessert_id); // 查 dessert name

      result.push({
        dessert_name: dessert?.dessert_name || '未知甜點',
        dessert_amout: item.amount,
        dessert_price: item.dessert_price,
        subtotal: item.amount * item.dessert_price,
        dessert_deadline: dayjs(item.dessert_deadline).format('YYYY-MM-DD HH:mm:ss'),
      });
    }

    // 將資料加到工作表
    result.forEach(item => worksheet.addRow(item));

    // 設定檔案 headers
    // res.setHeader(
    //   'Content-Type',
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    // );
    // res.setHeader(
    //   'Content-Disposition',
    //   'attachment; filename="order_detail.xlsx"'
    // );
    const fileName = encodeURIComponent('order_detail.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${fileName}`);


    // 寫入 Excel 並傳給前端
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Excel 產生失敗');
  }
});

//post//checkout

router.post('/checkout', async (req, res) => {
  try {
    const total = req.body.total;
    const order = req.body.order;
    const all_shoppinglist = req.body.all_shoppinglist;
    console.log("total", total);
    console.log("order", order);
    console.log("all_shoppinglist", all_shoppinglist);
    const newOrder = await dessertOrder.create({
        total: total, 
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail:order.customer_email,
        customerAddress:order.customer_address,
    });
    const orderId =newOrder.dessertOrderId;
    const time =dayjs(newOrder.orderDate).format('YYYY-MM-DD HH:mm:ss');
    let lines = [];
    lines.push(`親愛的 ${order.customer_name}，您的訂單已成立！`);
    for (let i = 0; i < all_shoppinglist.length; i++) {
      const oneItem = all_shoppinglist[i];
      const dessertId = oneItem.dessert_id;
      const amount = oneItem.dessert_amount;
      const dessertname = oneItem.dessert_name;
      const dessertPrice = oneItem.dessert_price;
      const subtotal=oneItem.subtotal;

  // 1. 查甜點的 dessert_preserve_date（天數）
        const dessertData = await Dessert.findByPk(dessertId);
        const preserveDays = dessertData?.dessert_preserve_date || 0;

  // 2. 使用 dayjs 加 preserveDays，得到保存期限時間（UTC+8）
    const preserveTime = dayjs().add(preserveDays, 'day').toDate(); // 轉成 JS Date 給 Sequelize

  // 3. 寫入 DessertOrderItem
    await dessertOrderItem.create({
    dessert_id: dessertData.dessert_id,
    dessertOrderId: orderId,
    amount: amount,
    dessert_price: dessertData.dessert_price,
    dessert_deadline: preserveTime, // 假設 DB 欄位是 timestamp
    });

    //4. 寫明細內容
    lines.push(
    `甜點名稱: ${dessertname}, 單價=${dessertPrice}, 小計=${subtotal}, 數量=${amount}, 保存期限=${preserveTime}`
    );    
  }

    lines.push(`共 ${total} 元`);
    await sendMail({
      to: order.customer_email,
      subject: `訂單通知`,
      text: lines.join('\n'),
    });

    res.send("訂單成立");
  

  } catch (error) {
    console.error('❌ 發生錯誤:', error);
    res.status(500).send('Server error');
  }
});

//POST /orderQuery
router.post('/orderQuery', async (req, res) => {
  try {
    const data = await dessertOrder.findAll();
    const formattedData = data.map(item => {
        const json = item.toJSON(); // 轉為純物件
        json.orderDate = dayjs(json.orderDate).format('YYYY-MM-DD HH:mm:ss');
        return json;
    });
    res.json(formattedData);

  } catch (err) {
    console.error('查詢優惠碼失敗:', err);
    res.status(500).send('Server Error');
  }
});




module.exports = router;