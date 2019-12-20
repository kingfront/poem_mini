// miniprogram/pages/pass/pass.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ads: null,
    tFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.showToast({
    //   title: '加载中...',
    //   icon: 'loading',
    //   duration: 10000
    // });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //dsf
        } else {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  canvasImg: function() {
    var that = this;
    wx.showLoading({
      title: '图片正在生成'
    });
    //拿到用户名称和用户头像 name ，img 
    var name = app.globalData.userInfo.nickName;
    var img = app.globalData.userInfo.avatarUrl.replace("http:", "https:");
    //拿到临时url 使用getImageInfo缓存到本地
    wx.getImageInfo({
      src: 'https://s.jktv.tv/wifi/wifi_activity/img/wx/mini_code_poem.png',
      success(res) {
        //liload  小程序码本地缓存地址
        var liload = res;
        //获取用户设备宽高
        wx.getImageInfo({
          src: img,
          success(res) {
            var width, height;
            wx.getSystemInfo({
              success(res) {
                width = res.screenWidth * 0.6;
                height = Math.round(width * 1066 / 600);
                that.setData({
                  canvasWidth: width,
                  canvasHeight: height
                });
              }
            });
            

            var x = width / 750; //设置相对canvas自适应根元素大小

            const ctx = wx.createCanvasContext('shareCanvas');
            ctx.drawImage('http://s.jktv.tv/wifi/test/static/step_bg.jpg', 0, 0, 500 * x, 812 * x);
            ctx.save();
            ctx.setTextAlign('center'); // 文字居中
            ctx.setFillStyle('#fff'); // 文字颜色：黑色
            ctx.setFontSize(16); // 文字字号
            ctx.fillText(name, 250 * x, 250 * x); //名字
            ctx.setFontSize(14); // 文字字号
            ctx.fillText('邀请你使用【拼拼宝盒】', 250 * x, 300 * x);
            ctx.save();
            //圆形头像框
            ctx.setStrokeStyle('rgba(0,0,0,.2)');
            ctx.arc(250 * x, 140 * x, 60 * x, 0, 2 * Math.PI);
            ctx.setStrokeStyle('rgba(0,0,0,.2)');
            ctx.arc(250 * x, 460 * x, 120 * x, 0, 2 * Math.PI);
            ctx.fill('#fff');
            //小程序码
            ctx.clip();
            ctx.drawImage(liload.path, 150 * x, 360 * x, 200 * x, 200 * x);
            //头像
            ctx.clip();
            ctx.drawImage(res.path, 190 * x, 80 * x, 120 * x, 120 * x);
            ctx.save();
            ctx.stroke();
            ctx.draw();

            wx.hideLoading();
          }
        });
      }
    })
  },
  btnTap: function() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    });
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.saveImg();
        } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImg();
            },
            fail() {
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none'
              })
            }
          })
        } else {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                that.saveImg();
              } else {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },
  saveImg: function() {
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function(res) {
        wx.hideLoading();
        var tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            wx.showModal({
              content: '图片已保存到相册，赶紧晒一下吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function(res) {
                if (res.confirm) {
                  var arr = [];
                  arr.push(tempFilePath);
                  //保存后全屏显示
                  wx.previewImage({
                    urls: arr,
                    current: arr
                  });
                }
              },
              fail: function(res) {}
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '没有相册权限',
              icon: 'none',
              duration: 2000
            });
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})