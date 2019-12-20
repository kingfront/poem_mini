// pages/auth/auth.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.saveUser(e.detail.userInfo);
      const db = wx.cloud.database()
      db.collection('vdMake').get({
        success: rt => {
          app.globalData.tFlag = rt.data[0].tFlag
          if (app.globalData.tFlag) {
            wx.switchTab({
              url: '/pages/step/step'
            })
          } else {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        },
        fail: err => {
        }
      })
    }
  },
  saveUser: function (obj) {
    var that = this;
    obj.appId = app.globalData.appId
    obj.openId = app.globalData.openId
    const db = wx.cloud.database();
    db.collection('userInfo').add({
      data: obj,
      success: res => { }
    })
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