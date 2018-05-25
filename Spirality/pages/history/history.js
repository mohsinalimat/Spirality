// pages/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    height:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    this.setData({
      width: res.windowWidth,
      height: res.windowHeight
    })
    var that = this;
    wx.getStorageInfo({
      success: function (res) {
        console.log(res.keys);
        let list = res.keys.filter( x => {
          return x.startsWith("image-")
        }).map( x=> {
          return x.slice(6)
        })
        console.log(list);
        that.setData({
          list: list
        })
      }
    })
  },

  cellClick(e){
    let image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: `../preview/preview?image=${image}`,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})