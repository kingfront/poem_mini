// pages/mine/mine.js
const app = getApp()
const Img = require("../../libs/data/image.js");
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageUrl: Img.imageArr[this.random(33)]
    })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.navigateTo({
    //         url: '/pages/auth/auth'
    //       })
    //     } else {
    //       wx.getUserInfo({
    //         success: res => {

    //         }
    //       })
    //       var ad = util.interstitialAd()
    //       if (ad) {
    //         ad.show().catch((err) => {
    //         })
    //       }
    //     }
    //   }
    // })
  },
  /**
   * 获取随机数
   */
  random: function (num) {
    var that = this;
    var list = that.data.channelList;
    var randomIndex = Math.floor(Math.random() * num);
    if (randomIndex == that.data.channelIndex) {
      randomIndex = Math.floor(Math.random() * num);
    }
    return randomIndex;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  toMin: function () {
    let that = this
    if (app.globalData.tFlag) {
      wx.switchTab({
        url: '/pages/step/index/index'
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wxf41876102dde0d23',
        path: 'pages/index/index',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'develop',
        success(res) {
          wx.showToast({
            title: '前往小程序',
          })
          that.addOpenMin(1)
        },
        fail(res) {
          that.addOpenMin(0)
        }
      })
    }
  },
  addOpenMin: function (t) {
    const db = wx.cloud.database();
    db.collection('openMin').add({
      data: {
        openType: t,
        name: '养生大师讲座',
        from: '个人中心',
        date: new Date()
      },
      success: res => {
      },
      fail: err => {
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      imageUrl: Img.imageArr[this.random(33)]
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})