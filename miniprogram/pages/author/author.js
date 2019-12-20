// pages/author/author.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cutFlg: true,
    authorInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    this.fetchAuthor(options.poetId)
    var ad = util.interstitialAd()
    if (ad) {
      ad.show().catch((err) => {
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 查询诗人信息
   */
  fetchAuthor: function (id) {
    const db = wx.cloud.database()
    db.collection('author').where({
      poetId: parseInt(id)
    }).get({
      success: res => {
        this.setData({
          authorInfo: res.data[0]
        })
        wx.hideToast();
      },
      fail: err => {
        wx.hideToast();
      }
    })
  },
  /**
   * 展示更多信息
   */
  moreInfo: function () {
     this.setData({
       cutFlg: this.data.cutFlg?false:true
     })
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