let dessertQuery = new Vue({
  el: '#dessertQuery',
  data: {
    dessertList:[],
    shoppinglist:{},
    dessertItem:{},
    all_shoppinglist:{},
    showDetailed:false,
    showShoppingDetailed:false,
    showModifiedDetailed:false,
    backviewdessert:false,
    itemError:'',
    amount:null,
    item:null,
    total:'',
    total_amount:'',
    showText:'',
    countdownSeconds: 0,
    sessionTimer: null,
    sessionExpiryMinutes: 4,
    ttlInMinutes:2,
  },
  methods:{
	  findAll: function(){
		  var _this = this;
		  axios.post('/dessert/dessertQuery',{
		  }).then(function(response){
			  _this.dessertList = response.data;
        // _this.backviewdessert=true;
		  }).catch(function(error){
			 console.log(error); 
		  });
	  },
    
      addShoppingCart: function(){
        let _this = this;
        axios.post('/dessert/addShoppingCart',{
            shoppinglist:this.shoppinglist,
            all_shoppinglist:JSON.parse(sessionStorage.getItem('all_shoppinglist'))
            // all_shoppinglist:sessionStorage.getItem('all_shoppinglist')

        }).then(function(response){
            // console.log(response.data);
            if (response.data === -1) {
              alert("後端驗證:請加入購物車")
            }else{
            _this.all_shoppinglist=response.data; // current_page good
            sessionStorage.setItem("all_shoppinglist",JSON.stringify(_this.all_shoppinglist));
                  // 設定 1 分鐘後過期時間
            const expiryTimestamp = Date.now() + (_this.sessionExpiryMinutes * 60000);
            sessionStorage.setItem("all_shoppinglist_expiry", expiryTimestamp);
                  // 開始計時，每分鐘清除 sessionStorage 中的購物車資料
     	      _this.startSessionCleaner(); 
            alert("新增成功");
            }
        }).catch(function(error){
           console.log(error); 
           alert("新增失敗")
        });
      },
      
      removeShoppingCart: function(data){
        let _this=this;
        axios.post('/dessert/removeShoppingCart',{
				  removeItem: data,
          all_shoppinglist:JSON.parse(sessionStorage.getItem('all_shoppinglist'))
			  }).then(function(response){
          _this.all_shoppinglist=response.data; // current_page good
          sessionStorage.setItem("all_shoppinglist",JSON.stringify(_this.all_shoppinglist));
          _this.total=_this.sumforcheck(_this.all_shoppinglist);
          alert("刪除成功");
			  }).catch(function(error){
				 console.log(error);
         alert("刪除失敗") 
			  });
      },

      modifyShoppingCart:function(){
        let _this=this;
        axios.post('/dessert/modifyShoppingCart',{
          modifyiedshoppinglist: this.shoppinglist,
          all_shoppinglist:JSON.parse(sessionStorage.getItem('all_shoppinglist'))
        }).then(function(response){
          _this.all_shoppinglist=response.data; // current_page good
          sessionStorage.setItem("all_shoppinglist",JSON.stringify(_this.all_shoppinglist));
          _this.total=_this.sumforcheck(_this.all_shoppinglist);
          _this.showModifiedDetailed=false;
          _this.showDetailed=false;
          _this.showShoppingDetailed=true;
        }).catch(function(error){
         console.log(error); 
        });

      },


      sumforcheck: function(all_shoppinglist){
        try{
        let total=0;
        for(let i=0;i<all_shoppinglist.length;i++){
          total+=all_shoppinglist[i].subtotal;
        }
        return total;}
        catch(e){
          return 0;
        }
      },

      loadModifyShoppingCart:function(data){
        let _this=this;
        _this.shoppinglist=data;
        _this.showModifiedDetailed=true;
        _this.showDetailed=false;
        _this.showShoppingDetailed=false;

      },


      backtoallpage:function(){
        let _this = this;
        _this.showDetailed=false;
        _this.showShoppingDetailed=false;
        _this.showModifiedDetailed=false;
      },

      

      checkShoppingCart:function(){
        let _this = this;
        _this.showDetailed=false;
        _this.showShoppingDetailed=true;
        _this.all_shoppinglist=JSON.parse(sessionStorage.getItem('all_shoppinglist'));
        _this.total=_this.sumforcheck(_this.all_shoppinglist);
      },


//checkShoppingCart: function(){
//  let _this = this;
//  _this.showDetailed = false;
//  _this.showShoppingDetailed = true;
//
//  let storedData = sessionStorage.getItem('all_shoppinglist');
//  if (storedData) {
//    try {
//      _this.all_shoppinglist = JSON.parse(storedData);
//    } catch (e) {
//      console.error("JSON parsing failed:", e);
//      _this.all_shoppinglist = [];
//    }
//  } else {
//    _this.all_shoppinglist = [];
//  }
//
//  _this.total = _this.sumforcheck(_this.all_shoppinglist);
//},

      loadDessert:function(data){
        let _this=this;
        _this.dessertItem=data;
        _this.showDetailed=true;
        _this.shoppinglist.item=_this.dessertItem.dessert_id.toString();
      },
      
//        // 加入帶有過期時間的 set 方法（預設 5 分鐘）
//  setSessionItemWithExpiry(key, value, ttlInMinutes) {
//    const now = new Date();
//    const item = {
//      value: value,
//      expiry: now.getTime() + ttlInMinutes * 60 * 1000,
//    };
//    sessionStorage.setItem(key, JSON.stringify(item));
//  },
//
//  // 讀取時自動檢查是否過期
//  getSessionItemWithExpiry(key) {
//    const itemStr = sessionStorage.getItem(key);
//    if (!itemStr) return null;
//
//    const item = JSON.parse(itemStr);
//    const now = new Date();
//
//    if (now.getTime() > item.expiry) {
//      sessionStorage.removeItem(key);
//      return null; // 已過期
//    }
//
//    return item.value;
//  },



//	startSessionCleaner: function() {
//  	const _this = this;
//  
//  // 清理 sessionStorage 中的 'all_shoppinglist'，每 1 分鐘清除一次
//  setInterval(function() {
//    sessionStorage.removeItem('all_shoppinglist');
//    console.log('sessionStorage: all_shoppinglist 已清除');
//    _this.all_shoppinglist = {};  // 清空前端的購物車資料，避免顯示過期資料
//    _this.total='';
//   }, 60000); // 60000 毫秒 = 1 分鐘
// },



startSessionCleaner: function() {
  const _this = this;

  // 避免重複定時器
  if (_this.sessionTimer) {
    clearInterval(_this.sessionTimer);
  }

  _this.sessionTimer = setInterval(function() {
    const expiry = parseInt(sessionStorage.getItem('all_shoppinglist_expiry'));
    const now = Date.now();

    if (!expiry || now > expiry) {
      sessionStorage.removeItem('all_shoppinglist');
      sessionStorage.removeItem('all_shoppinglist_expiry');
      _this.all_shoppinglist = {};
      _this.total = '';
      _this.countdownSeconds = 0; // ✅ 顯示為 0 秒
      clearInterval(_this.sessionTimer);
      console.log('⏱ 購物車已過期並清除');
    } else {
      const remainSeconds = Math.floor((expiry - now) / 1000);
      _this.countdownSeconds = remainSeconds; // ✅ 更新 Vue 畫面顯示
//      console.log(`⏱ 剩下 ${remainSeconds} 秒`);
    }
  }, 1000);
}

//  cleanExpiredSessionItems() {
//    const keysToCheck = ['all_shoppinglist']; // 你想清理的 key 名單
//    const now = new Date().getTime();
//
//    keysToCheck.forEach(key => {
//      const itemStr = sessionStorage.getItem(key);
//      if (!itemStr) return;
//
//      try {
//        const item = JSON.parse(itemStr);
//        if (item.expiry && now > item.expiry) {
//          sessionStorage.removeItem(key);
//          console.log(`🔔 session '${key}' 已過期，已自動清除`);
//        }
//      } catch (e) {
//        console.warn(`⚠️ 無法解析 session '${key}'，跳過`);
//      }
//    });
//  }
      
      

  },

  watch:{
    "shoppinglist.dessert_amount":function(){
      let _this=this;
      axios.post('/dessert/checkTotalAmount',{
        monitoring_item: this.shoppinglist,
      }).then(function(response){
        _this.total_amount=response.data;
      }).catch(function(error){
       console.log(error); 
      });
    },
    "shoppinglist.amount":function(){
      if(this.shoppinglist.amount===""){
        this.itemError='請加入購物車';
      }else{
        this.itemError='';
      }
    },

    "dessertList":function(){
      let _this=this;
      axios.post('/dessert/findCurrentPromoteProject',{
      }).then(function(response){
        _this.showText=response.data;
      }).catch(function(error){
       console.log(error); 
      });
    }

  },
  
//	mounted: function () {
// 	 this.startSessionCleaner(); // 定時清理 session
//	},



  created:function(){
	  this.findAll();
      var _this = this;
      _this.shopplinglist={};
      _this.backviewdessert=false;
  }
})