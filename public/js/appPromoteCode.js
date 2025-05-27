let PromoteCode = new Vue({
el:'#appPromoteCode',
data:{
    promoteCodeList:[],

},
methods:{
    findPromoteCode:function(){
        var _this = this;
		axios.post('/dessert/promoteCodeQuery',{
		}).then(function(response){
		_this.promoteCodeList = response.data;
		}).catch(function(error){
		 console.log(error); 
		});
    },

},










  created:function(){
    var _this = this;
    this.findPromoteCode();
    _this.backviewdessert=false;
    _this.showalldessert=false;
  }


})