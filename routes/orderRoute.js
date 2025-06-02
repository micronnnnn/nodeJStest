const express = require('express');
const router = express.Router();
const dessertOrder = require('../models/order'); // 直接引入單一 Model
const dessertOrderItem = require('../models/orderItem'); // 直接引入單一 Model
const Dessert = require('../models/dessert'); // 直接引入單一 Model
const  { sendMail }  = require('../utility/mail'); // 直接引入單一 Model
const dayjs = require('dayjs');


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

    for (let i = 0; i < all_shoppinglist.length; i++) {
      const oneItem = all_shoppinglist[i];
      const dessertId = oneItem.dessert_id;
      const amount = oneItem.dessert_amount;
      const dessertPrice = oneItem.dessert_price;

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
    }

    await sendMail({
      to: order.customer_email,
      subject: `親愛的 ${order.customer_name}，您的訂單已成立！`,
      text: "test",
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