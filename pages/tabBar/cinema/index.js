Page({
  data:{
    city:'',
    cinema:{
      items:[],
      labels:[],
    },
    location:{
      lng:'',
      lat:'',
    },
    paging:{
      hasmore:'',
    }
  },
  onLoad: function () {
    var _this = this;
    // 获取用户的位置信息
    wx.getLocation({
      success:function(res) {
          // console.log(res);
        const {latitude,longitude} = res
        // 调用接口获取具体城市
        wx.request({
          url:"https://wx.maoyan.com/hostproxy/locate/v2/rgeo",
          method:"get",
          data:{
              coord:[latitude,longitude,1].join(','),
          },
          // 自定义头信息
          header:{
              "x-host":"http://apimobile.vip.sankuai.com"
          },
          success:function(info) {
              // console.log(info);
              _this.setData({
                city:info.data.data.city,
                'location.lat':info.data.data.lat,
                'location.lng':info.data.data.lng,
              })
              // 成功获取用户位置再发送列表请求
              wx.request({
                  url: 'https://wx.maoyan.com/hostproxy/mmcs/cinema/v1/select/cinemas.json',
                  method: 'get',
                  data: {
                    cityId:20,
                    limit:12,
                    offset:0,
                    channelId:40000,
                    lng:info.data.data.lat,
                    lat:info.data.data.lng,
                   },
                  success:function(res) {
                    var info = res.data.data;
                    // console.log(res);
                    _this.setData({
                      'cinemas.items':info.cinemas,
                      'paging.hasmore':info.paging.hasMore,
                    })
                    // console.log(info.cinemas[0].labels)
                  }
              })      
          }
        })
      }
    });
  },
  // 滚动到底部刷新
  onReachBottom:function () {
    var _this = this;
    if (!_this.data.paging.hasmore) return ;

    console.log('上拉加载-----')
    wx.showLoading({
      title:"正在加载..."
    });

    wx.request({
      url: 'https://wx.maoyan.com/hostproxy/mmcs/cinema/v1/select/cinemas.json',
      method: 'get',
      data: {
        cityId:20,
        limit:12,
        offset:0,
        channelId:40000,
        lng:_this.data.location.lng,
        lat:_this.data.location.lat,
       },
      success:function(res) {
        var info = res.data.data;
        // console.log(res);
        _this.setData({
          'cinemas.items':_this.data.cinemas.items.concat(info.cinemas),
          'paging.hasmore':info.paging.hasMore,
        })
        // console.log(info.cinemas[0].labels)
      }
  })      
  wx.hideLoading();

  }



});