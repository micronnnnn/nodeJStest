let appBackViewOrder_modify = new Vue({
    el: '#appBackViewOrder_modify',
    data: {
        orderList: [],
        order:{},
        orderItemList:[],
        showDetailed:false,
        customer_nameError:'',
        customer_phoneError:'',
        customer_emailError:'',
        customer_addressError:'',
        errorMsg:[],


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


        loadOrder:function(d){
            let _this=this;
            _this.showDetailed=true;
            _this.order=d;
      
        },

        


        modifyOrder:function(){
            var _this=this;
            axios.post('/dessert/ordermodify',{
              order:this.order
                }).then(function(response){
              console.log(response.data);
              if(response.data==="修改成功"){
                alert("修改成功");
                window.location="/dessert/orderView";
              }else{
                _this.errorMsg=response.data;
                alert("後端驗證from springboot     "+"\r"+_this.errorMsg);
                // alert("修改失敗");
      
              }
      
      
                }).catch(function(error){
                   console.log(error); 
                });
          },
  },
  watch:{
    "order.customer_name":function(){
      if(this.order.customer_name===""){
        this.customer_nameError='訂購人不得為空白';
      }else{
        this.customer_nameError='';
      }
    },
    "order.customer_phone":function(){
      if(this.order.customer_phone===""){
        this.customer_phoneError='訂購人電話不得為空白';
      }else{
        this.customer_phoneError='';
      }
    },
    "order.customer_email":function(){
      if(this.order.customer_email===""){
        this.customer_emailError='訂購人郵件不得為空白';
      }else{
        this.customer_emailError='';
      }
    },
    "order.customer_address":function(){
      if(this.order.customer_address===""){
        this.customer_addressError='訂購人住址不得為空白';
      }else{
        this.customer_addressError='';
      }
    },


  }


})