// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    poetName: '',
    poetId: '',
    poemInfo: null,
    cutFlg: true,
    tabFix: false
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
    this.setData({
      poetId: options.poetId,
      poetName: options.poetName
    })
    this.fetchPoem(options.poetryId)
  },
  /**
   * 查询诗信息
   */
  fetchPoem: function (id) {
    const db = wx.cloud.database()
    db.collection('poem').where({
      poetryId: parseInt(id)
    }).get({
      success: res => {
        res.data[0].content = res.data[0].content.replace(/\n/g, '')
        res.data[0].content = res.data[0].content.replace(/。/g,'。\n')
        res.data[0].content = res.data[0].content.replace(/？/g, '。\n')
        let TabCur = 0
        if (!res.data[0].about && res.data[0].fanyi){
          TabCur = 1
        } else if (!res.data[0].fanyi && res.data[0].shangxi) {
          TabCur = 2
        }
        this.setData({
          TabCur: TabCur,
          poemInfo: res.data[0]
        })
        wx.hideToast();
      },
      fail: err => {
        wx.hideToast();
      }
    })
  },
  tabSelect(e) {
    this.setData({
      cutFlg: true,
      TabCur: e.currentTarget.dataset.id
    })
  },
  /**
   * 展示更多信息
   */
  moreInfo: function () {
    this.setData({
      cutFlg: this.data.cutFlg ? false : true
    })
  },
  toAuthor: function(e){
    wx.navigateTo({
      url: '/pages/author/author?poetId=' + e.currentTarget.dataset.poetid
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
  onPageScroll: function (e) {
    let that = this;
    var query = wx.createSelectorQuery();
    query.select('.up-view').boundingClientRect()
    query.exec(function (res) {
      if ((res[0].height + res[0].top) <= 0){
        that.setData({
          tabFix: true
        })
      }else{
        that.setData({
          tabFix: false
        })
      }
    })
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