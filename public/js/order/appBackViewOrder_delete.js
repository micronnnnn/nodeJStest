let appBackViewOrder_delete = new Vue({
    el: '#appBackViewOrder_delete',
    data: {
        orderList: [],
        order:{},
        orderItemList:[],
        backviewdessert: false,
        showalldessert: false,
        showorderItem:false,
        inputString: "",
    },
    methods: {
        findAll: function () {
            var _this = this;
            axios.post('/dessert/orderQuery', {
            }).then(function (response) {
                _this.orderList = response.data;
                _this.backviewdessert = true;
                _this.showalldessert = true;
            }).catch(function (error) {
                console.log(error);
            });
        },

        deleteOrder:function(d){
            var _this=this;
            axios.post('/dessert/orderdelete',{
              order:d
                }).then(function(response){
              if(response.data==="刪除成功"){
                alert("刪除成功");
                window.location="/dessert/orderView";
              }else{
                alert("刪除失敗");
      
              }
      
      
                }).catch(function(error){
                   console.log(error); 
                });
          }







    },
})