// miniprogram/pages/step/step.js
const util = require("../../../utils/util.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxAuth: false,
    runList: null,
    openid: '',
    userInfo: null,
    windowHeight: app.globalData.windowHeight,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '步数圈'
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    this.fetchRunList();
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
            that.setData({
              wxAuth: true
            })
          wx.hideToast();
        } else {
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              app.globalData.userInfo = res.userInfo;
              that.fetchWxRunn()
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  fetchWxRunn: function () {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
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
            let stepInfoList = rep.result.event.weRunData.data.stepInfoList;
            let today = stepInfoList[stepInfoList.length-1];
            var date = new Date(today.timestamp * 1000);
            date = util.formatTime(date);
            date = date.substring(0,10);
            let info = app.globalData.userInfo;
            info.step = today.step;
            info.date = date;
            info.openid = rep.result.openid;
            that.saveStep(info);
            that.setData({
              step: info.step,
              openid: rep.result.openid
            })
          },
          fail: err => {
            // handle error
          }
        })
      }
    })
  },
  saveStep: function (info){
    let that = this;
    const db = wx.cloud.database();
    var date = util.formatDate(new Date());
    db.collection('step').where({
      _openid: info.openid,
      date: date
    }).get({
      success: res => {
        if (res.data && res.data.length>0){
          db.collection('step').doc(res.data[0]._id).update({
            data: {
              step: info.step
            },
            success: res => {
              that.fetchRunList(true)
            },
            fail: err => {
            }
          })
        }else{
          db.collection('step').add({
            data: info,
            success: res => { 
              that.fetchRunList(true)
            }
          })
        }
      },
      fail: err => {
      }
    })
  },
  fetchRunList: function(f){
    const db = wx.cloud.database();
    var date = util.formatDate(new Date());
    db.collection('step').where({
      date: date
    }).orderBy('step', 'desc').get({
      success: res => {
        this.setData({
          runList: res.data
        })
        if(f){
          wx.hideToast();
        }
        wx.stopPullDownRefresh();
      },
      fail: err => {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    }) 
  },
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        wxAuth: false
      })
      app.globalData.userInfo = e.detail.userInfo;
      this.fetchWxRunn();
      var that = this;
      const db = wx.cloud.database();
      db.collection('userInfo').add({
        data: app.globalData.userInfo,
        success: res => { }
      })
    }
  },
  authClose: function () {
    this.setData({
      wxAuth: false
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
    this.fetchRunList();
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