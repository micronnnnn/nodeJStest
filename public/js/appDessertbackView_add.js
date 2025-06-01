let dessertQuerybackView_add = new Vue({
  el: '#appDessertbackView_add',
  data: {
    dessertItem:{
      dessert_name:'',
      dessert_price:'',
      dessert_amount:'',
      dessert_instruction:'',
      dessert_preserve_date:'',
      dessert_type_id:'',
      dessertpic:'',

    },

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
    addRes:0,


  },
  methods:{
	  uploadData: function(){
		  var _this = this;
		  axios.post('/dessert/dessertAdd',{
        dessertItem:this.dessertItem,
		  }).then(function(response){
        if(response.data!=="新增成功"){
          _this.errorMsg=response.data;
          console.log(_this.errorMsg);
          // _this.addRes=-1;//validate後直接alarm出來
            alert("後端驗證from springboot     "+"\r"+_this.errorMsg);
           }else{
            alert(response.data);
            window.location="/backView"; //Window.location only accept post request
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

          imageresult = e.target.result.startsWith("data:image");
          // imageresult=e.target.result.substring(5,10)==="image";
          _self.imageURL=e.target.result;
          if(imageresult){
          _self.dessertPicErr='';
          _self.imageRegion=1;
          }else{
            _self.imageRegion=0;
            _self.dessertPicErr="請確認上傳圖片格式"
          } 
          _self.dessertItem.dessertpic = e.target.result.split(',')[1];
          console.log('Base64純圖內容：', _self.dessertItem.dessertpic);

          
      }

    },
    
    initData: function(){
      var _this = this;
      _this.dessertItem={people:0,score:0};
      _this.addRes=0;
  } 
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