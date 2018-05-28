![banner](https://user-images.githubusercontent.com/9360037/40588778-8121f6be-6215-11e8-929f-836eec86f90f.jpg)

## Spirality - 螺旋绘画

> Create beautiful drawings reminiscent of old Spirograph toys. Draw, color and write to create one-of-a-kind decorations, invitations and doodles. Watch pleasing colors and shapes flow from your pen and mouse - you'll feel like a true artist.
> 
> 启发于微软平台的 [Spirality](https://www.microsoft.com/en-us/store/p/spirality/9pgtlzjj1rs6)。由于它的魔性吸引力和iOS平台无类似App，决定来模仿并探索绘画App的画笔记录、橡皮擦、历史播放等等功能。
> 
> 🔗  [AppStore](https://itunes.apple.com/us/app/spirality/id1318807907)      🔗  [微信小程序](https://github.com/ZhipingYang/Spirality/tree/mini_pro)

### ScreenShot

<p align="center">
<img width=32% src="https://user-images.githubusercontent.com/9360037/40588195-56065348-620c-11e8-8868-5a630d9684d5.jpeg"> <img width=32% src="https://user-images.githubusercontent.com/9360037/40588196-565816ce-620c-11e8-8ff0-0f3292e9da4d.jpeg"> <img width=32% src="https://user-images.githubusercontent.com/9360037/40586865-7e5eb9e6-61fa-11e8-8ade-a3e0e22eee34.png">
</p>

## 功能

- [x]  颜色选取
- [x]  画笔阵列
- [x]  画笔类型切换
      - [x]  钢笔 
      - [x]  水桶 
      - [ ]  对称
- [x]  图层清除
- [x]  画笔记录撤销、恢复
- [x]  保存
      - [x]  保存为图片
      - [ ]  恢复上次未完成记录
      - [ ]  保存历史作画记录
- [x]  播放绘画过程
      - [ ]  停止播放

### 用法

| Class                                                                 | Info                                                                           |
|:---------------------------------------------------------------------:|:------------------------------------------------------------------------------:|
| OverlayerView                                                         | **内容承载类：**主体UI交互、功能选择、SpiralityCanvas子视图。                                      |
| SpiralityCanvas                                                       | **阵列画笔绘图：**touch事件绘图，与Overview之间传递交互事件。`之所以不使用CAReplicatorLayer阵列绘制，考虑到动画播放功能` |
| SpiralityStack                                                        | **画笔记录：**实现记录播放，撤销恢复记录操作                                                       |
| [ChromaColorPicker](https://github.com/joncardasis/ChromaColorPicker) | 第三方颜色选择器                                                                       |

## Other Demo

<p align="center"><img width=33% src="https://user-images.githubusercontent.com/9360037/40588552-985a12de-6211-11e8-8c39-d88d0cf9c469.jpeg"> <img width=33% src="https://user-images.githubusercontent.com/9360037/40588549-96eb5d0e-6211-11e8-8d05-170f8abe5c04.jpeg"> <img width=33% src="https://user-images.githubusercontent.com/9360037/40588551-978cfaf6-6211-11e8-9cf8-e59b230d86d0.jpeg"> <img width=33% src="https://user-images.githubusercontent.com/9360037/40588548-969baf34-6211-11e8-8e8e-906f1c78e04d.jpeg"> <img width=33% src="https://user-images.githubusercontent.com/9360037/40588546-9556a516-6211-11e8-8cc4-c78392b02522.jpeg"> <img width=33% src="https://user-images.githubusercontent.com/9360037/40588547-95b92c2c-6211-11e8-9206-eb9ba4d14ba7.jpeg"></p>

## Author

XcodeYang, xcodeyang@gmail.com

## License

XYDebugView is available under the MIT license. See the LICENSE file for more info.
