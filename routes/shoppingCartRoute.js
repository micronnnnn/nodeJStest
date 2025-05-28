const express = require('express');
const router = express.Router();
const Dessert = require('../models/dessert'); // 直接引入單一 Model

//addShoppingCart
router.post('/addShoppingCart', async (req, res) => {
  try {
    const jsonRequests = req.body;
    console.log('backend received is', JSON.stringify(jsonRequests));

    const shoppinglist = jsonRequests.shoppinglist;
    const item = shoppinglist.item;
    const amount = shoppinglist.amount || 0;

    if (amount === 0) {
      return res.send('-1');
    }

    // 沒有購物車清單，建立新購物車
    if (
      !jsonRequests.all_shoppinglist ||
      jsonRequests.all_shoppinglist.length === 0
    ) {
      const dessert = await Dessert.findByPk(item);
      if (!dessert) return res.status(404).send('Dessert not found');

      const cart = [
        {
          dessert_name: dessert.dessert_name,
          dessert_price: dessert.dessert_price,
          dessert_id: dessert.dessert_id,
          dessert_amount: amount,
        },
      ];
      return res.json(setDataForVue(cart));
    } else {
      // 有購物車清單，檢查是否已有相同項目
      const cart = jsonRequests.all_shoppinglist;
      let found = false;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].dessert_id === item) {
          cart[i].dessert_amount += amount;
          found = true;
          break;
        }
      }

      if (!found) {
        const dessert = await Dessert.findByPk(item);
        if (!dessert) return res.status(404).send('Dessert not found');

        cart.push({
          dessert_name: dessert.dessert_name,
          dessert_price: dessert.dessert_price,
          dessert_id: dessert.dessert_id,
          dessert_amount: amount,
        });
      }

      return res.json(setDataForVue(cart));
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//removeShoppingCart
router.post('/removeShoppingCart', async (req, res) => {
  try {
    const jsonRequests = req.body;
    console.log("backend received is", jsonRequests);

    const removeItem = jsonRequests.removeItem;
    const id_remove = removeItem.dessert_id;
    let cart = jsonRequests.all_shoppinglist;

    // 移除指定項目
    cart = cart.filter(item => item.dessert_id !== id_remove);

    // for (let i = 0; i < cart.length; i++) {
    //     if (cart[i].dessert_id === id_remove) {
    //         cart.splice(i, 1); // 移除該項
    //         break; // 移除後跳出迴圈
    //     }
    // }   

    // 使用共用函式處理回傳資料
    const vueFormattedCart = await setDataForVue(cart);

    res.json(vueFormattedCart);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//modifyShoppingCart
router.post('/modifyShoppingCart', async (req, res) => {
  try {

    //     const modifiedItem = req.body.modifyiedshoppinglist;
    // const id_modify = modifiedItem.dessert_id;
    // const amount_modify = modifiedItem.dessert_amount;

    // let cart = req.body.all_shoppinglist;

    // for (let i = 0; i < cart.length; i++) {
    //   if (cart[i].dessert_id === id_modify) {
    //     cart[i].dessert_amount = amount_modify;
    //     break;
    //   }
    // }

    // const result = await setDataForVue(cart); // 處理格式轉換
    // res.json(result);
    const { modifyiedshoppinglist, all_shoppinglist } = req.body;
    console.log('backend received is', req.body);

    const id_modify = modifyiedshoppinglist.dessert_id;
    const amount_modify = modifyiedshoppinglist.dessert_amount;

    // 使用 map 改寫指定項目的 amount
    const updatedCart = all_shoppinglist.map(item =>
      item.dessert_id === id_modify
        ? { ...item, dessert_amount: amount_modify }
        : item
    );

    const result = await setDataForVue(updatedCart);
    res.send(result);

  } catch (err) {
    console.error('Error in modifyShoppingCart:', err);
    res.status(500).send('Error modifying shopping cart');
  }
});


// checkProductAmout
router.post('/checkTotalAmount', async (req, res) => {
  try {
    const monitoringItem = req.body.monitoring_item;
    if (!monitoringItem || !monitoringItem.dessert_id) {
      return res.status(400).send('Invalid request: missing dessert_id');
    }

    const idMonitoring = monitoringItem.dessert_id;

    const dessert = await Dessert.findOne({
      attributes: ['dessert_amount'],
      where: { dessert_id: idMonitoring }
    });

    if (!dessert) {
      return res.status(404).send('Dessert not found');
    }

    const totalAmount = dessert.dessert_amount;

    console.log(totalAmount);

    res.send(totalAmount.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// helper function
function setDataForVue(cart) {
  return cart.map((item) => ({
    dessert_name: item.dessert_name,
    dessert_price: item.dessert_price,
    dessert_id: item.dessert_id,
    dessert_amount: item.dessert_amount,
    subtotal: item.dessert_price * item.dessert_amount,
  }));
}

module.exports = router;
