let appBackViewOrder = new Vue({
    el: '#appBackViewOrder',
    data: {
        orderList: [],
        order: {},
        orderItemList: [],
        backviewdessert: false,
        showalldessert: false,
        showorderItem: false,
        inputString: "",
        inputStringErr: '',
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

        findStringData: function () {
            var _this = this;
            axios.post('/dessert/orderQueryCustomerName', {
                inputString: this.inputString,
            }).then(function (response) {
                if (response.data === -1) {
                    alert("後端驗證:請輸中文或者英文開頭")
                }
                else {
                    _this.orderList = response.data;
                    _this.backviewdessert = true;
                    _this.showalldessert = true;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },

        loadOrder: function (d) {
            var _this = this;
            axios.post('/dessert/getOrderDetailed', {
                order: d
            }).then(function (response) {
                _this.orderItemList = response.data;
                _this.backviewdessert = false;
                _this.showalldessert = false;
                _this.showorderItem = true;

            }).catch(function (error) {
                console.log(error);
            });

        },

        downloadOrder: function (d) {
            let _this = this;
            axios.post('/dessert/download', {
                order: d,
            }, { responseType: 'blob' }).then(function (response) {
                _this.download(response);
                alert("下載成功");
            }).catch(function (error) {
                console.log(error);
                alert("下載失敗");
            });

        },

        download(response) {
            if (!response) {
                return;
            }
            let url = window.URL.createObjectURL(new Blob([response.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            //透過decodeURI 將UTF-8轉碼 
            const fileName = decodeURI(response.headers["content-disposition"].split("=")[1]);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

        },



        PreviousPage: function () {
            var _this = this;
            _this.backviewdessert = false;
            _this.showalldessert = false;
            _this.showorderItem = false;
        },

        PreviousPage2: function () {
            var _this = this;
            _this.backviewdessert = true;
            _this.showalldessert = true;
            _this.showorderItem = false;
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

    }
})