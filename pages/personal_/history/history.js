const app = getApp();
const url = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hisData: null, //历史信息
    url:'https://www.xhufindlost.com:80/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '等待',
    })
    //获取openid
    let openid = wx.getStorageSync("openid");

    var that = this;
    wx.request({
      url: url + 'personal/history',
      method: 'POST',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        that.setData({
          hisData: res.data
        })
      },
      fail(e) {
        console.log(e);
        wx.showToast({
          title: '获取信息失败',
          icon:'none',
          duration:1500
        })
      },
      complete(){
        wx.hideLoading();
      }
    })
  },
  info_detail:function(e){
    let id = e.currentTarget.dataset.id;
    let bigkind = e.currentTarget.dataset.bigkind;
    console.log(e)
    wx.navigateTo({
      url: '/pages/main/single/single?id=' + id + '&bigkind=' + bigkind,
    })
  }


})