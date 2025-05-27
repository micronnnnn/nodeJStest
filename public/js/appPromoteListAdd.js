let PromteListAdd = new Vue({
    el: '#appPromoteListAdd',
    data: {
        projectList: [],
        promoteDate: {},
        dessertList: [],
        promoteDessert: {},
        onepromoteItem: {},
        // a:1,

    },


    methods: {
        findAllPromoteProject: function () {
            var _this = this;
            axios.post('/dessert/AllPromoteProject', {
            }).then(function (response) {
                // console.log(response.data);
                _this.projectList = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },

        findAll: function () {
            var _this = this;
            axios.post('/dessert/dessertQuery', {
            }).then(function (response) {
                _this.dessertList = response.data;
                // _this.backviewdessert=true;
            }).catch(function (error) {
                console.log(error);
            });
        },

        addPromteDetailed: function () {
            var _this = this;
            axios.post('/dessert/addPromteDetailed', {
                onepromoteItem: this.onepromoteItem,
            }).then(function (response) {
                alert("新增至redis成功")
            }).catch(function (error) {
                console.log(error);
            });
        }





    },

    created: function () {
        this.findAll();
    }















})