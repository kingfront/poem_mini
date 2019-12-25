//app.js
var plugin = requirePlugin("chatbot");
App({
  data() {
    return {
      robot:'./images/robot.png',
      backgroundHeight: '',
      statusBarHeight: ''
    }
  },
  onLaunch: function () {
    this.globalData = {
      tFlag: false,
      userInfo: null
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        let isIOS = res.system.indexOf('iOS') > -1
        let navHeight = 0
        if (!isIOS) {
          navHeight = 48
        } else {
          navHeight = 44
        }
        this.data.backgroundHeight = res.windowHeight
        this.data.statusBarHeight = res.statusBarHeight + navHeight
      }
    })
    let that = this
    let address = this.data.backgroundHeight+ "px"
    let url = "url('http://res.wx.qq.com/mmspraiweb_node/dist/static/xieshi/xiaoweiBackground.png')" + " " + "no-repeat" + " " + "scroll" + " " + "0px" + " " + "0px" + "/" + "100%" + " " + address
    plugin.init({
      appid: "dDZ4gDfuttwzo7twXmpetaVWeEJwKX",
      success: () => { },
      fail: error => { },
      guideList: ["歌曲稻香", "相声", "李白","今日新闻","天气如何"],
      textToSpeech: false,
      welcome: "您好，我是小依智能机器人，请问有什么需要帮助？",
      // welcomeImage: 'http://inews.gtimg.com/newsapp_bt/0/10701537095/1000',
      background: url,
      guideCardHeight: 50,
      operateCardHeight: 60,
      history: true,
      historySize: 20,
      navHeight: 0,
      robotHeader: 'https://img.alicdn.com/tfs/TB1Mjw8cYr1gK0jSZR0XXbP8XXa-264-264.png',
      userHeader: that.globalData.userInfo ? that.globalData.userInfo:'https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/rightHeader.png',
      userName: '嘻嘻嘻'
    });
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
  }
})
