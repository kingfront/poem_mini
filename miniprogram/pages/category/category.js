// pages/category/category.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchFlg: false,
    poemList: [],
    currentIndex: '0',
      niandai:{
        name:[],
        index:[]
      },
      author: {
        name: [],
        index: []
      },
      type: {
        name: [],
        index: []
      },
    tagList: [],
    dataList:[
      [{ name:'先秦'}, { name: '两汉' }, { name: '魏晋' }, { name: '南北朝隋代' }, { name: '唐代' }, { name: '五代' }, { name: '宋代' }, { name: '金朝' }, { name: '元代' }, { name: '明代' }, { name: '清代' }, { name: '近现代' }],
      [{name:'李白'},{ name: '杜甫' }, { name: '苏轼' }, { name: '王维' }, { name: '杜牧' }, { name: '陆游' }, { name: '李煜' }, { name: '元稹' }, { name: '韩愈' }, { name: '岑参' }, { name: '齐己' }, { name: '贾岛' }, { name: '柳永' }, { name: '曹操' }, { name: '李贺' }, { name: '曹植' }, { name: '张籍' }, { name: '孟郊' }, { name: '皎然' }, { name: '许浑' }, { name: '罗隐' }, { name: '贯休' }, { name: '韦庄' }, { name: '屈原' }, { name: '王勃' }, { name: '张祜' }, { name: '王建' }, { name: '晏殊' }, { name: '岳飞' }, { name: '姚合' }, { name: '卢纶' }],
  [{ name:'写景'}, { name: '咏物' }, { name: '春天' }, { name: '夏天' }, { name: '秋天' }, { name: '冬天' }, { name: '写雨' }, { name: '写雪' }, { name: '写风' }, { name: '写花' }, { name: '梅花' }, { name: '荷花' }, { name: '菊花' }, { name: '柳树' }, { name: '月亮' }, { name: '山水' }, { name: '写山' }, { name: '写水' }, { name: '长江' }, { name: '黄河' }, { name: '儿童' }, { name: '写鸟' }, { name: '写马' }, { name: '田园' }, { name: '边塞' }]
    ],
    searchName: null,
    pageSize: 13,
    pageNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchName: options.searchName
    })
    this.fetchPoemList()
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
  * 查询诗词列表
  */
  fetchPoemList: function (type) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let dynastyList = this.data.dataList[0];
    let search = []
      for (let i = 0; i < dynastyList.length; i++) {
        if (dynastyList[i].flg) {
          search.push({
            dynasty: dynastyList[i].name
          })
        }
      }
      let authorList = this.data.dataList[1];
      for (let i = 0; i < authorList.length; i++) {
        if (authorList[i].flg) {
          search.push({
            name: authorList[i].name
          })
        }
      }
    if (search.length < 1){
      if (this.data.searchName){
        search.push({
          name: this.data.searchName
        })
      }else{
        search.push({
          dynasty: '唐代'
        })
      }
    }
    const db = wx.cloud.database()
    const _ = db.command
    let skip = (this.data.pageNumber - 1) * this.data.pageSize + 1
    db.collection('author').where(_.or(search))
      .skip(type?skip:0)
    .limit(this.data.pageSize)
    .get({
      success: res => {
        if (res && res.data.length > 0){
          let num = this.data.pageNumber + 1
          let list = this.data.poemList
          if(type){
            list = list.concat(res.data)
          }else{
            list = res.data
          }
          this.setData({
            pageNumber: num,
            poemList: list
          })
          wx.hideToast();
        }else{
          wx.showToast({
            title: '没有查询到哦',
            icon: 'success',
            duration: 15000
          });
        }
        wx.stopPullDownRefresh();
      },
      fail: err => {
        wx.hideToast();
        console.info(err)
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
   * 点击筛选类型
   */
  showSearch(e) {
    let index = e.currentTarget.dataset.index
    let searchFlg = this.data.searchFlg ? false : true
    if (!searchFlg) {
      index = 0
      this.setData({
        currentIndex: index,
        searchFlg: searchFlg
      })
    }else{
      this.setData({
        tagList: this.data.dataList[index - 1],
        currentIndex: index,
        searchFlg: searchFlg
      })
    }
  },
  /**
   * 点击筛选类型
   */
  selectTab(e) {
    let name = e.currentTarget.dataset.info
    let index = e.currentTarget.dataset.index
    this.data.tagList[index].flg = this.data.tagList[index].flg?false:true
    this.data.dataList[this.data.currentIndex-1] = this.data.tagList

    this.setData({
      dataList: this.data.dataList,
      tagList: this.data.tagList
    })
  },
  makeSearch() {
    this.fetchPoemList(false)
    this.setData({
      searchFlg: false
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchPoemList(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchPoemList(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})