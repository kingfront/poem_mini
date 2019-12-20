//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    //获取广告策略
    const db = wx.cloud.database();
    db.collection('ads').where({
    }).get({
      success: res => {
        this.globalData.ads = res.data;
      },
      fail: err => {
      }
    })
    db.collection('vdMake').get({
      success: res => {
        this.globalData.tFlag = res.data[0].tFlag
      },
      fail: err => {
      }
    })
    this.globalData = {
      tFlag:false
    }
  }
})
