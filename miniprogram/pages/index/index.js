//index.js
const app = getApp()
const Img = require("../../libs/data/image.js");
const util = require("../../utils/util.js");
Page({
  data: {
    userInfo: {},
    mingjuInfo: {},
    authorInfo: null,
    imageUrl: null,
    topTip: true,
    ads: null,
    tFlag: app.globalData.tFlag
  },
  onLoad: function(option) {
    var that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    that.fetchMingJu()
    if (option.scene) {
      that.saveLogo(option.scene)
    }
    setTimeout(function(){
      that.hideTopTip()
    },5000)
  },
  /**
   * 查询名句信息
   */
  fetchMingJu: function() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    this.setData({
      imageUrl: Img.imageArr[this.random(33)]
    })
    
    var ad = util.interstitialAd('adunit-4207b730d6be7ec7')
    if (ad) {
      ad.show().catch((err) => {
      })
    }
    const db = wx.cloud.database()
    db.collection('mingju').where({
      id: this.random(5764)
    }).get({
      success: res => {
        this.setData({
          ads: app.globalData.ads[1],
          tFlag: app.globalData.tFlag,
          mingjuInfo: res.data[0]
        })
        if (res.data[0].poetId == '0') {
          this.fetchMingJu();
        } else {
          this.fetchAuthor(res.data[0].poetId)
        }
        wx.stopPullDownRefresh();
      },
      fail: err => {
        wx.hideToast();
      }
    })

  },
  /**
   * 查询诗人信息
   */
  fetchAuthor: function(id) {
    const db = wx.cloud.database()
    db.collection('author').where({
      poetId: id
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
  toHappy: function() {
    wx.switchTab({
      url: '/pages/step/index/index'
    })
    // if (app.globalData.tFlag){
    //   wx.navigateTo({
    //     url: '/pages/joke/joke'
    //   })
    // }else{
    //   const db = wx.cloud.database();
    //   db.collection('vdMake').get({
    //     success: res => {
    //       app.globalData.tFlag = res.data[0].tFlag
    //       if (app.globalData.tFlag) {
    //         wx.navigateTo({
    //           url: '/pages/joke/joke'
    //         })
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/category/category'
    //         })
    //       }
    //     },
    //     fail: err => {
    //     }
    //   })
    // }
  },
  bindclose: function() {
    this.data.ads.adFlg = false
    this.setData({
      ads: this.data.ads
    })
    var ad = util.interstitialAd('adunit-4207b730d6be7ec7')
    if (ad) {
      ad.show().catch((err) => {
      })
    }
  },
  hideTopTip: function() {
    this.setData({
      topTip: false
    })
  },
  onPullDownRefresh: function() {
    this.fetchMingJu();
  },
  /**
   * 获取随机数
   */
  random: function(num) {
    var that = this;
    var list = that.data.channelList;
    var randomIndex = Math.floor(Math.random() * num);
    if (randomIndex == that.data.channelIndex) {
      randomIndex = Math.floor(Math.random() * num);
    }
    return randomIndex;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  saveLogo: function(scene) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('channel').add({
      data: {
        appId: app.globalData.appId,
        openId: app.globalData.openId,
        scene: scene
      },
      success: res => {}
    })
  }
})