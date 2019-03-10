Page({
    data:{

    },
    spread: function () {
        this.setData({
            spread: !this.data.spread
        })
    },
    preview: function () {
        // wx.preview
    },
    // onload中可以接收页面地址上传来的参数
    onLoad:function(params) {
        console.log(params);
        var _this = this;
        var id = params.mid;
        // 发送请求
        wx.request({
            url:'http://wx.maoyan.com/movie/ '+ id + '.json',
            method:'get',
            header:'Content-type: application/json',
            success:function(res) {
                // console.log(res);
            }
        })
    }

});