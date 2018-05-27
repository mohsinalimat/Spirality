// pages/history.js
var isLongTap = false;

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
    if (isLongTap) {
      isLongTap = false;
      return;
    }
    let image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: `../preview/preview?image=${image}`,
    })
  },

  deleteImage(e){
    isLongTap = true;
    let image = e.currentTarget.dataset.image;
    console.log("deleteImage:", image)

    wx.showModal({
      title: '删除图片',
      confirmText:'删除',
      success(res){
        if (res.confirm) {
          // 删除
          wx.removeSavedFile({
            filePath: image,
            complete(res) {
              console.log(res);
            }
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})