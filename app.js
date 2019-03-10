
  /**
   * 用户点击右上角分享
   */
wx.showShareMenu({
  withShareTicket: true
})
// 获取用户信息
wx.getSetting({
  success(res) {
    if (!res.authSetting['scope.record']) {
      wx.authorize({
        scope: 'scope.record',
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          wx.getUserInfo()
        }
      })
    }
  }
})