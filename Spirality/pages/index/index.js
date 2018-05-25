// canvas.js

Page({
  data: {
    windowWidth: 0, 
    color: 'red', // 画笔颜色
    count: 30,  // 阵列数量
    isPen: true,  // 是否使用钢笔
    isAblePre: true,  // 可以使用上一步
    isAbleNext: true, // 可以使用下一步
  },
  // contextArray:[],
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    this.setData({
      windowWidth: res.windowWidth,
    })
  },
  touchstart(e) {
    if (e.touches.length > 1) { return; }

    let { clientX, clientY } = e.touches[0];
    this.prePointX = clientX;
    this.prePointY = clientY;
    this.context = wx.createCanvasContext("firstCanvas")
    this.context.setStrokeStyle(this.data.color)
    this.context.setLineWidth(3)
    this.context.setLineCap('round')
    this.context.moveTo(this.prePointX, this.prePointY)

    console.log("1", this.prePointX, this.prePointY);
  },
  touchmove(e) {
    if (e.touches.length > 1) { 
      this.touchcancel()
      return; 
    }

    console.log("2", this.prePointX, this.prePointY);

    let { clientX, clientY } = e.touches[0];
    this.context.moveTo(this.prePointX, this.prePointY)
    this.context.lineTo(clientX, clientY)
    this.context.stroke()
    this.prePointX = clientX;
    this.prePointY = clientY;
    
    console.log("3", this.prePointX, this.prePointY);

    let context = this.context;
    wx.drawCanvas({
      canvasId: "firstCanvas",
      reserve: true,
      actions: context.getActions()
    })
  },
  touchend(e) {
    // if (e.touches.length > 1) {
    //   this.touchcancel()
    //   return; 
    // }
    // this.context.stroke()
    // this.context.draw()
  },
  touchcancel(e) {
    // this.context.stroke()
    // this.context.draw()
  },
  // 画笔类型
  penChange: function (e) {
    console.log('penchanged', e)

    let isPen = !this.data.isPen;
    console.log(isPen);

    this.setData({
      isPen: isPen
    })
  },
  // 画笔颜色
  colorChange(e) {
    console.log('colorChange', e)

    let color = "green";
    this.setData({
      color: color
    })
  },
  // 画笔阵列
  countChange(e){
    console.log('countChange', e)

    let count = this.data.count + 1;
    this.setData({
      count: count
    })
  },
  // 清楚画板
  clean(e){
    console.log('clean', e)

  },
  // 上一步
  rollBack(e) {
    console.log('rollBack', e)

  },
  // 下一步
  moveForward(e) {
    console.log('moveForward', e)

  },
  // 保存为图片
  save(e){
    console.log('save', e)

  },
  // 播放
  play(e){
    console.log('play', e)

  }
})