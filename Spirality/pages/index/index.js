// canvas.js

Page({
  data: {
    windowWidth: 0,
    windowHeight: 0,
  },
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    this.setData({
      windowWidth = res.windowWidth,
      windowheight = res.windowheight
    })
  },
})