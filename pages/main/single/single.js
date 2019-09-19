// pages/main/single/single.js
const app = getApp();
const url = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singleData: null, //单个数据
    url: 'https://www.xhufindlost.com:80/',
    isContactVisibal:true//联系方式可看吗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '请等待',
    })
    let personalInfo=wx.getStorageSync("personalInfo");
    //如果没有填取个人信息联系方式不可看
    if(personalInfo==""){
        this.setData({
          isContactVisibal:false
        })
    }
    let id = options.id;
    let bigkind = options.bigkind;
    var that = this;
    wx.request({
      url: url + 'getInfoById',
      method: "POST",
      data: {
        id: id,
        bigkind: bigkind
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          singleData:res.data
        })
      },
      fail(e) {
        console.log(e)
      },
      complete(){
        wx.hideLoading();
      }
    })
  },
  ViewImage(e) {
    let newUrl = this.data.url+this.data.singleData.goodsPhoto;
    wx.previewImage({
      urls: [newUrl]
    });
  },
  //复制到粘贴板
  copyContact:function(){
    let content = this.data.singleData.goodsContact;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }
})