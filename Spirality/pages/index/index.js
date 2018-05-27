// canvas.js

Page({
  data: {
    windowWidth: 0, 
    color: '#abc88b', // 画笔颜色
    count: 30,  // 阵列数量
    isPen: true,  // 是否使用钢笔
    isAblePre: false,  // 可以使用上一步
    isAbleNext: false, // 可以使用下一步
    isShowTool: true, // 左边工具栏展示
    isShowColorPicker: false, // 颜色选择器
    isShowCounter:false,
  },
  windowWidth:0,
  windowHeight: 0,
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    this.windowWidth = res.windowWidth;
    this.windowHeight = res.windowHeight;
    console.log(this);
  },

  // 绘图事件
  touchstart(e) {
    if (e.touches.length > 1) { return; }
    
    let { clientX, clientY } = e.touches[0];
    this.prePointX = clientX;
    this.prePointY = clientY;
    if (!this.context) {
      this.context = wx.createCanvasContext("firstCanvas", this)
      this.context.setLineWidth(0.5)
      this.context.setFillStyle('black');
    }
    this.context.setStrokeStyle(this.data.color)
  },
  touchmove(e) {
    if (e.touches.length > 1) { 
      this.touchcancel()
      return; 
    }
    if (this.data.isShowTool) {
      this.setData({
        isShowTool: false
      })
    }

    let { clientX, clientY } = e.touches[0];

    for(let i=0; i<this.data.count; i++) {
      let [fromX, fromY] = this.convertPointByCenterOfPoint(this.prePointX, this.prePointY, i);
      let [endX, endY] = this.convertPointByCenterOfPoint(clientX, clientY, i);
      this.context.moveTo(fromX, fromY);
      this.context.lineTo(endX, endY);
    }
    this.context.stroke()

    this.prePointX = clientX;
    this.prePointY = clientY;
    
    let actions = this.context.getActions();
    // 实时渲染
    wx.drawCanvas({
      canvasId: "firstCanvas",
      reserve: true,
      actions: actions
    })
  },
  touchend(e) {
    this.setData({
      isShowTool: true
    })
  },
  touchcancel(e) {
    this.context.clearActions();

    this.setData({
      isShowTool: true
    })
  },


  // 画笔类型
  penChange: function (e) {
    let isPen = !this.data.isPen;
    this.setData({ isPen: isPen })
  },
  // 画笔颜色
  triggerPicker(e) {
    // 去掉counter
    if (this.data.isShowCounter) {
      this.setData({ isShowCounter: false })
    }
    let isShowColorPicker = this.data.isShowColorPicker;
    this.setData({ isShowColorPicker: !isShowColorPicker })
  },
  colorChange(e) {
    let color = e.currentTarget.dataset.color;
    this.setData({
      color: color,
      isShowColorPicker: false
    })
  },
  // 画笔阵列
  triggerCounter(e) {
    // 去掉colorPicker
    if (this.data.isShowColorPicker) {
      this.setData({ isShowColorPicker: false })
    }
    // 防止 input 点击触发隐藏
    if (e.target.id === "CountChangerInput") { return }

    let isShowCounter = this.data.isShowCounter;
    this.setData({
      isShowCounter: !isShowCounter
    })
  },
  countChange(e){
    var count = Math.max(e.detail.value, 1)
    count = Math.min(count, 100)
    this.setData({
      count: count
    })
  },
  countPlus(e) {

    let count = this.data.count + 1;
    this.setData({
      count: Math.min(count, 100)
    })
  },
  countReduce(e) {
    let count = this.data.count - 1;
    this.setData({
      count: Math.max(count,1)
    })
  },
  // 清楚画板
  clean(e){
    this.dismissFocus()
    wx.drawCanvas({
      canvasId: "firstCanvas",
      reserve: false,
      actions: []
    })
  },
  // 上一步
  rollBack(e) {
    console.log('rollBack', e)
    this.dismissFocus()
  },
  // 下一步
  moveForward(e) {
    console.log('moveForward', e)
    this.dismissFocus()
  },
  // 保存为图片
  save(e){
    console.log('save', e)
    this.dismissFocus()
    let width = this.windowWidth;
    let height = this.windowHeight;

    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      x: 0,
      y: (height-width)/2.0,
      width: width,
      height: width,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        wx.setStorage({
          key: ("image-" + res.tempFilePath),
          data: res.tempFilePath,
        })
      }
    }, this)
  },
  // 播放
  play(e){
    console.log('play', e)
    wx.navigateTo({
      url: '../history/history',
    })
  },

  dismissFocus(e){
    console.log("dismissFocus");
    if (this.data.isShowCounter || this.data.isShowColorPicker){
      this.setData({
        isShowCounter: false,
        isShowColorPicker: false,
      })
    }
  },

  // 用触摸点坐标和第index阵列 获取阵列的坐标
  convertPointByCenterOfPoint(pointX, pointY, index) {
    let centerX = this.windowWidth / 2.0;
    let centerY = this.windowHeight / 2.0;
    let increaseAngle = Math.PI * 2.0 * index / this.data.count;
    let radius = Math.sqrt((centerX - pointX) * (centerX - pointX) + (centerY - pointY) * (centerY - pointY))
    let angel = this.getAngleOnXAxisFromPoint(centerX, centerY, pointX, pointY) + increaseAngle;
    let resultX = Math.cos(angel) * radius + centerX;
    let resultY = Math.sin(angel) * radius + centerY;
    return [resultX, resultY];
  },

  getAngleOnXAxisFromPoint(startX, startY, endX, endY) {
    let xForwardStartX = startX + 10;
    let a = endX - startX;
    let b = endY - startY;
    let c = xForwardStartX - startX;
    let d = startY - startY;
    let rads = Math.acos(((a * c) + (b * d)) / ((Math.sqrt(a * a + b * b)) * (Math.sqrt(c * c + d * d))));
    return startY > endY ? (-rads) : rads;
  }

})