Page({
    data: {
        tabIndex: 'hots',
        hots:{
          items:[],
          page:1,
          hasMore:''
        },
        city:"",
        plans:{
          v1:{items:[]},
          v2:{items:[]}
        },
        limit:12,
        page:2
    },
    switch: function (ev) {
      var _this = this;
      // console.log(ev)
        this.setData({
            tabIndex: ev.target.dataset.tabIndex
        });

        // 用户点击待映请求数据 (页面已经有数据就不再发请求，避免重复请求)
        if (ev.target.dataset.tabIndex == "plan" && !this.data.plans.v1.items.length) {
          // 获取最受喜欢列表
          wx.request({
            url:"https://wx.maoyan.com/mmdb/movie/v1/list/wish/order/coming.json",
            method:"get",
            data:{
              ci:1,
              limit:30,
              offset:0
            },
            success:function(info1) {
              // console.log(info1);
              info1.data.data.coming.forEach(function(val) {
                val['img'] = val['img'].replace('w.h',170.230);
                // 修改日期
                var date = new Date(val['rt']);
                var m = date.getMonth() + 1;
                var d = date.getDay();
  
                val['date'] = m + '月' + d + "日";
  
               });
              _this.setData({
                'plans.v1.items' : info1.data.data.coming,
              });

            }
          });
          // 获取其他待映列表
          wx.request({
            url:"https://wx.maoyan.com/mmdb/movie/v2/list/rt/order/coming.json",
            method:"get",
            data:{
              ci:1,
              limit:10,
            },
            success:function(info2) {
              // console.log(info2);
              var comingTitle = '';
              info2.data.data.coming.forEach(function(val) {
                val['img'] = val['img'].replace('w.h',128.180);
                // 把日期进行归类
                if (comingTitle !== val.comingTitle) {
                  comingTitle = val.comingTitle;
                  // console.log(comingTitle);
                  val['comingTitle'] = comingTitle;
                } else {
                  val['comingTitle'] = '';
                }
               
            });

              _this.setData({
                'plans.v2.items' : info2.data.data.coming
              });

            }

          })
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
                // 成功获取用户位置再发送列表请求
                wx.showLoading({
                  title:"正在加载..."
                })
                wx.request({
                    url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
                    method: 'get',
                    data: {
                      limit: _this.data.limit,
                      offset: 0,
                      ct:'info.data.city'
                    },
                    success:function(res) {
                      // console.log(res);
                      res.data.data.hot.forEach(function(val) {
                          val['img'] = val['img'].replace('w.h',128.180);
                      });
                      _this.setData({
                        "hots.items":res.data.data.hot,
                        // 第一页发现没数据，第二页也不再进行请i去
                        "hots.hasMore":res.data.data.paging.hasMore,
                        city:info.data.data.city,
                      });
                    },
                })
              wx.hideLoading();
          
            }
          })
        }
      });
    },
    // 当页面滚动到底部的时候触法
    onReachBottom:function () {
      console.log('上拉加载-----')
      var _this = this;
      if (!_this.data.hots.hasMore) return;
      wx.showLoading({
        title:"正在加载..."
      });

      wx.request({
        url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
        method: 'get',
        data: {
          limit: _this.data.limit,
          offset:(_this.data.hots.page-1)*_this.data.limit,
          ct:_this.data.city
        },
        success:function(res) {
          // console.log(res);
          res.data.data.hot.forEach(function(val) {
              val['img'] = val['img'].replace('w.h',128.180);
          });
          _this.setData({
            "hots.items":_this.data.hots.items.concat(res.data.data.hot),
            page:_this.data.hots.page++,
            "hots.hasMore":res.data.data.paging.hasMore,
          });
        },
    })
    wx.hideLoading();

    },
    // 当开启下拉刷新后可以使用事件对下拉动作进行监听
    onPullDownRefresh:function() {
      console.log('下拉-----')
      var _this = this;
      // if (!_this.data.hots.hasMore) return;
      wx.request({
        url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
        method: 'get',
        data: {
          limit: _this.data.limit,
          offset:0,
          ct:_this.data.city
        },
        success:function(res) {
          //获取到的元素直接覆盖之前的元素
          // console.log(res);
          res.data.data.hot.forEach(function(val) {
              val['img'] = val['img'].replace('w.h',128.180);
          });
          _this.setData({
            "hots.items":res.data.data.hot,
            // 下拉刷新获取到第一页,页码更新为2
            page:2,
            "hots.hasMore":res.data.data.paging.hasMore,
          });
        },
      })
      // 让上面的几个点停止
      wx.stopPullDownRefresh();
    },
    
    
});