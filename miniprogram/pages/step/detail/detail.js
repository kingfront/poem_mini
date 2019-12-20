// pages/step/detail/detail.js
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepInfoList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '历史步数'
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    this.fetchWxRunn();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  fetchWxRunn: function () {
    let that = this;
    wx.getWeRunData({
      success(res) {
        wx.cloud.callFunction({
          name: 'wxrun',
          data: {
            weRunData: wx.cloud.CloudID(res.cloudID),
            obj: {
              shareInfo: wx.cloud.CloudID(res.cloudID),
            }
          },
          success: rep => {
            let stepInfoList = rep.result.event.weRunData.data.stepInfoList.reverse();
            for (let i = 0; i < stepInfoList.length;i++){
              let date = new Date(stepInfoList[i].timestamp * 1000);
              date = util.formatTime(date);
              date = date.substring(0, 10);
              stepInfoList[i].timestamp = date;
            }
            that.setData({
              stepInfoList: stepInfoList
            })
            wx.hideToast();
            wx.stopPullDownRefresh();
          },
          fail: err => {
            wx.hideToast();
            // handle error
          }
        })
      }
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