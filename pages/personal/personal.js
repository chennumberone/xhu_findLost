const app = getApp();
const url = app.globalData.url;

var msgData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      msgNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //缓存获取msgNum
    const storageInfo = wx.getStorageSync("msgNum");
    let num = 0; //消息条数
    if (storageInfo != "" || storageInfo != null) {
      num = storageInfo;
    }


    //获取openid
    let openid = wx.getStorageSync("openid");
    var that = this;
    wx.request({
      url: url + 'personal/msg',
      method: 'POST',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        msgData=res.data;
        let length = res.data.length;
        let msgNum=length-num;
        that.setData({
          msgNum:msgNum
        })        
      },
      fail(e) {
        console.log(e);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  navchange_personInfo: function() {
    wx.navigateTo({
      url: '../personal_/info/info',
    })
  },
  navToMsg:function(){
    let msg = JSON.stringify(msgData);
    wx.navigateTo({
      url: '../personal_/msg/msg?msgData=' + msg
    })
    this.setData({
      msgNum:0
    })
  }
})