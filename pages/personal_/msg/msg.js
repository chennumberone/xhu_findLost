Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgData: null, //获取的消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let msgData = JSON.parse(options.msgData);
    //增加josn数组属性辅助展开收起功能
    let length = msgData.length;
    for (let i = 0; i < length; i++) {
      msgData[i].index = i;
      msgData[i].status = false;
    }
    this.setData({
      msgData: msgData
    })
    wx.setStorage({
      key: 'msgNum',
      data: msgData.length,
    })
  },
  changeStatus:function(e){
    let index = e.currentTarget.dataset.index;
    let msgTemp=this.data.msgData;
    msgTemp[index].status = !msgTemp[index].status;
    this.setData({
      msgData:msgTemp
    })
  }
})