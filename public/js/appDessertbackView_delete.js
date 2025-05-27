let dessertQuerybackView_delete = new Vue({
  el: '#appDessertbackView_delete',
  data: {
    dessertList:[],
    dessertItem:{},

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


    deleteDessert:function(d){
      var _this=this;
      axios.post('/dessert/dessertdelete',{
        dessertItem:d
		  }).then(function(response){
        if(response.data==="刪除成功"){
          alert("刪除成功");
          window.location="/dessert/backView";
        }else{
          alert("刪除失敗");

        }


		  }).catch(function(error){
			 console.log(error); 
		  });
    }

 
  },
})