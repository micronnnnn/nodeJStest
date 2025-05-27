let dessertQuerybackView_modify = new Vue({
  el: '#appDessertbackView_modify',
  data: {
    dessertList:[],
    dessertItem:{},
    showDetailed:false,

    dessertNameErr:'',
    dessertpriceErr:'',
    dessertAmountErr:'',
    dessertInstructionErr:'',
    dessertDateErr:'',
    dessertPicErr:'',
    dessertTypeErr:'',
    imageURL:null,
    imageRegion:0,
    errorMsg:[],

  },
  methods:{
	  findAll: function(){
		  var _this = this;
		  axios.post('/dessert/dessertQuery',{
		  }).then(function(response){
			  _this.dessertList = response.data;

		  }).catch(function(error){
			 console.log(error); 
		  });
	  },

    loadDessert:function(d){
      let _this=this;
      _this.showDetailed=true;
      _this.dessertItem=d;

    },


    modifyDessert:function(){
      var _this=this;
      axios.post('/dessert/dessertmodify',{
        dessertItem:this.dessertItem
		  }).then(function(response){
        console.log(response.data);
        if(response.data==="修改成功"){
          alert("修改成功");
          window.location="/dessert/backView";
        }else{
          _this.errorMsg=response.data;
          alert("後端驗證from springboot     "+"\r"+_this.errorMsg);
          // alert("修改失敗");

        }


		  }).catch(function(error){
			 console.log(error); 
		  });
    },

    getBase64andPreview: function(e){
      const _self = this;
      let imageresult;
      let [file] = e.target.files;
      console.log('previewDataURI', file);
      const _fileReader = new FileReader();
      _fileReader.readAsDataURL(file);
      _fileReader.onload = function(e) {
          imageresult=e.target.result.substring(5,10)==="image";
          _self.imageURL=e.target.result;
          if(imageresult){
          _self.dessertPicErr='';
          _self.imageRegion=1;
          }else{
            _self.imageRegion=2;
            _self.dessertPicErr="請確認上傳圖片格式"
          } 
          _self.dessertItem.dessertpic = e.target.result;
      }

    },

 
  },

  watch:{
    "dessertItem.dessertpic":function(){
      if(!this.dessertItem.dessertpic){
        this.dessertPicErr='照片不得為空白';
      }
    },

    "dessertItem.dessert_name":function(){
      if(this.dessertItem.dessert_name===""){
        this.dessertNameErr='甜點名稱不得為空白';
      }else{
        this.dessertNameErr='';
      }
    },

    "dessertItem.dessert_price":function(){
      if(this.dessertItem.dessert_price===""){
        this.dessertpriceErr='甜點價格不得為空白';
      }else{
        this.dessertpriceErr='';
      }
    },

    "dessertItem.dessert_amount":function(){
      if(this.dessertItem.dessert_amount===""){
        this.dessertAmountErr='甜點數量不得為空白';
      }else{
        this.dessertAmountErr='';
      }
    },

    "dessertItem.dessert_instruction":function(){
      if(this.dessertItem.dessert_instruction===""){
        this.dessertInstructionErr='甜點說明不得為空白';
      }else{
        this.dessertInstructionErr='';
      }
    },

    
    "dessertItem.dessert_preserve_date":function(){
      if(this.dessertItem.dessert_preserve_date===""){
        this.dessertDateErr='甜點賞味期限不得為空白';
      }else{
        this.dessertDateErr='';
      }
    },

    "dessertItem.dessert_type_id":function(){
      if(!this.dessertItem.dessert_type_id){
        this.dessertTypeErr='甜點種類不得為空白';
      }else{
        this.dessertTypeErr='';
      }

    }









  }
})