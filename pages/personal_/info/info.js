// pages/personal_/info/info.js
const app = getApp();
const url = app.globalData.url;

function success_upload() {
  wx.showToast({
    title: '保存成功',
    icon: 'success',
    duration: 2000,
    success() {
      setTimeout(
        function() {
          wx.navigateBack({
            delta: 1
          })
        },
        2000
      )
    }
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    picker: ['马克思主义学院', '经济学院', '管理学院', '文学与新闻传播学院', '外国语学院', '美术与设计学院', '音乐与舞蹈学院', '社会发展学院', '计算机与软件工程学院', '理学院', '材料科学与工程学院', '机械工程学院', '能源与动力工程学院', '电气与电子信息学院', '土木建筑与环境学院', '汽车与交通学院', '食品与生物工程学院', '体育学院', '知识产权学院、法学院', '大健康管理学院', '航空航天学院', '西华学院', '凤凰学院', '应用技术学院', '后备军官学院'],
    index1: -1,
    picker1: ['2015级', '2016级', '2017级', '2018级', '2019级'],
    stuName: "", //名字
    stuNum: "", //学号
    stuMajor: "", //专业
    isDisabled: "", //是否可以修改信息
    isSave: true, //是保存还是修改
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'personalInfo',
      success: function(res) {
        let data = res.data;
        that.setData({
          index: data.index,
          index1: data.index1,
          stuName: data.stuName,
          stuNum: data.stuNum,
          stuMajor: data.stuMajor,
          isSave:data.isSave,
          isDisabled:data.isDisabled
        })
      },
    })
  },
  PickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  PickerChange1: function(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  nameInput: function(e) {
    this.data.stuName = e.detail.value;
  },
  numInput: function(e) {
    this.data.stuNum = e.detail.value;
  },
  majorInput: function(e) {
    this.data.stuMajor = e.detail.value;
  },
  //提交
  submit: function() {
    //如果是修改
    if (!this.data.isSave) {
      this.setData({
        isSave: true,
        isDisabled: ''
      })
      return;
    }
    var that = this;
    //判断是否为空
    if (this.data.stuName == '' || this.data.stuNum == '' || this.data.stuMajor == '' || this.data.index == -1 || this.data.index1 == -1) {
      wx.showToast({
        title: '请填取完整信息',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({
      title: '保存中',
    })

    //取出openid
    let openid = "";
    try {
      openid = wx.getStorageSync("openid");
    } catch (e) {
      wx.showToast({
        title: '系统故障1',
        icon: 'none'
      })
    }

    // //取出上传次数（用户清楚缓存会出现问题）
    // var upload_times = 1;
    // try {
    //   const res = wx.getStorageInfoSync();
    //   for (let i = 0; i < res.keys.length; i++) {
    //     if (res.keys[i] == "personalInfo") {
    //       upload_times = wx.getStorageSync("personalInfo").upload_times;
    //       upload_times++;
    //     }
    //   }
    // } catch (e) {
    //   console.log(e)
    // }

    //上传信息
    wx.request({
      url: url + 'personal/stuInfo',
      method: "POST",
      data: {
        stuName: that.data.stuName,
        stuNum: that.data.stuNum,
        stuClass: that.data.picker1[that.data.index1],
        stuAcademy: that.data.picker[that.data.index],
        stuMajor: that.data.stuMajor,
        openid: openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data == 'yes') {
          success_upload();
          //保存变修改
          that.data.isSave=false;
          that.data.isDisabled="disabled";
          //存入缓存
          let json_obj = {
            "stuName": that.data.stuName,
            "stuNum": that.data.stuNum,
            "index1": that.data.index1,
            "index": that.data.index,
            "stuMajor": that.data.stuMajor,
            "isSave":that.data.isSave,
            "isDisabled":that.data.isDisabled,
            "upload_times": upload_times
          }
          wx.setStorage({
            key: 'personalInfo',
            data: json_obj,
          })
          

        } else {
          wx.showToast({
            title: '系统故障',
            icon: 'none'
          })
        }
      },
    })
  }
})