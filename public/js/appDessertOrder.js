let appDessertOrder = new Vue({
el: '#appDessertOrder',
data:{
    total:'',
    all_shoppinglist:{},
    order:{},
    promoteCode:'',
    promoteValue:1,
    difference_pirce:'',
    promoteErr:'',
    customer_nameError:'',
    customer_phoneError:'',
    customer_emailError:'',
    customer_addressError:'',
    errorMsg:[],


},
methods:{

    checkout:function(){
        let _this=this;
        axios.post('/dessert/checkout',{
            order: this.order,
            all_shoppinglist:JSON.parse(sessionStorage.getItem('all_shoppinglist')),
            total:this.total
          }).then(function(response){
            if(response.data==="訂單成立"){
            alert("訂單已成立"); 
            sessionStorage.removeItem("all_shoppinglist");
            window.location="/frontView";// why modelAndView no work axios response problem it can not be regonized a new ModelAndView in spring boot
            }else{
              _this.errorMsg=response.data;
              alert("後端驗證from springboot     "+"\r"+_this.errorMsg);
            }
          }).catch(function(error){
           console.log(error);
           alert("訂單不成立"); 
          });
    },









    checkShoppingCart:function(){
        let _this = this;
        _this.all_shoppinglist=JSON.parse(sessionStorage.getItem('all_shoppinglist'));
        _this.total=_this.sumforcheck(_this.all_shoppinglist);
      },
    // usePromoteCode:function(){
    //   let _this = this;
    //   let a=_this.sumforcheck(_this.all_shoppinglist);
    //   _this.checkout_price=Math.round(_this.promoteValue*a);

    // },

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

},
watch:{ // data validate from vue
  "promoteCode":function(){
    let _this=this;
    axios.post('/dessert/promoteCode',{
      promoteCode: this.promoteCode,
    }).then(function(response){
      if(response.data===1){
        _this.promoteErr='優惠代碼已失效或輸入錯誤';
        _this.difference_pirce=0;
        _this.total=_this.sumforcheck(_this.all_shoppinglist);
      }else{
        _this.promoteErr='';
        _this.total=Math.round(_this.sumforcheck(_this.all_shoppinglist)*response.data);
        _this.difference_pirce=_this.sumforcheck(_this.all_shoppinglist)-_this.total;
      }
      _this.promoteValue=response.data;
    }).catch(function(error){
     console.log(error); 
    });

  },
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


},


created:function(){
    this.checkShoppingCart();
}

})