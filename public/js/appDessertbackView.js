let dessertQuerybackView = new Vue({
  el: '#appDessertbackView',
  data: {
    dessertList: [],
    dessertItem: {},
    backviewdessert: false,
    showalldessert: false,
    inputString: "",
    inputmaxValue: '',
    inputStringErr: '',
    numberErr: '',

  },
  methods: {
    findAll: function () {
      var _this = this;
      axios.post('/dessert/dessertQuery', {
      }).then(function (response) {
        _this.dessertList = response.data;
        _this.backviewdessert = true;
        _this.showalldessert = true;
      }).catch(function (error) {
        console.log(error);
      });
    },

    findStringData: function () {
      var _this = this;
      axios.post('/dessert/dessertName', {
        inputString: this.inputString,
      }).then(function (response) {
        if (response.data === -1) {
          alert("後端驗證:請輸中文或者英文開頭")
        }
        else {
          _this.dessertList = response.data;
          _this.backviewdessert = true;
          _this.showalldessert = true;
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    findAmountData: function () {
      var _this = this;
      axios.post('/dessert/dessertNumber', {
        inputmaxValue: this.inputmaxValue,
      }).then(function (response) {
        if (response.data === -1) {
          alert("後端驗證:請輸入大於0數字")
        }
        else {
          _this.dessertList = response.data;
          _this.backviewdessert = true;
          _this.showalldessert = true;
        }
      }).catch(function (error) {
        console.log(error);
      });
    },



    PreviousPage: function () {
      var _this = this;
      _this.backviewdessert = false;
      _this.showalldessert = false;

    },

    initData: function () {
      var _this = this;
      _this.backviewdessert = false;
      _this.showalldessert = false;
    }
  },

  watch: {
    "inputString": function () {
      let inputStringFormate = /^[(\u4e00-\u9fa5)(a-zA-Z)]{1,}$/;
      if (this.inputString === "") {
        this.inputStringErr = '查詢不得為空白'
      } else {
        if (inputStringFormate.test(this.inputString)) {
          this.inputStringErr = '';
        } else {
          this.inputStringErr = '請輸中文或者英文開頭';
        }
      }
    },

    "inputmaxValue": function () {
      if (this.inputmaxValue === "") {
        this.numberErr = "查詢不得為空白"
      } else {
        if (this.inputmaxValue <= 0) {
          this.numberErr = "最小值不得小於0"
        } else {
          this.numberErr = '';
        }
      }

    }






  }


})