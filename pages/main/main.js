// pages/main/main.js
const app = getApp();
const url = app.globalData.url;
//每次查询的条数
let query_number=10;
//封装request为Promise
function createPromise(dataUrl, page, kind) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url + dataUrl,
      data: {
        page: page,
        kind: kind
      },
      success(res) {
        resolve(res);
      }
    })
  })
}

function Toast() {
  wx.showToast({
    title: '亲，我已经到底了',
    icon: 'none',
    duration: 1400
  })
}

//时间过滤 列表页面不显示年份
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
if (month < 10) {
  month = '0' + month;
}
//单个时间过滤
function timeFilter(time) {
  let yearTake = time.substr(0, 4);
  let monthTake = time.substr(5, 2);
  let dayTake = time[9];
  if (time[8] != '0') {
    dayTake = time.substr(8, 2);
  }
  let timeFinal = "";
  if (monthTake == month) {
    let day = date.getDate();

    if (day == dayTake) {
      timeFinal = "今天";
    } else if (day - dayTake == 1) {
      timeFinal = "昨天";
    } else if (day - dayTake == 2) {
      timeFinal = "前天";
    } else {
      if (monthTake[0] == '0') {
        timeFinal = monthTake[1] + "月" + dayTake + "日"
      } else {
        timeFinal = monthTake + "月" + dayTake + "日"
      }
    }
  } else {
    if (monthTake[0] == '0') {
      timeFinal = monthTake[1] + "月" + dayTake + "日"
    } else {
      timeFinal = monthTake + "月" + dayTake + "日"
    }
  }
  return timeFinal + time.substr(11, 5);
}
//数组时间过滤
function timeGroupFilter(timeGroup) {
  let length = timeGroup.data.length;
  for (let i = 0; i < length; i++) {
    timeGroup.data[i].goodsPubtime = timeFilter(timeGroup.data[i].goodsPubtime);
  }
  return timeGroup;
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    url: 'https://www.xhufindlost.com:80/',
    dataList: null, //前台渲染数据
    selected: true, //true 为寻找失物   false归还失物
    bigKind: '全部', //大类
    cardCur: 0, //轮番图
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/1.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/2.jpg',
    }, {
      id: 2,
      type: 'image',
        url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/3.jpg'
    }, {
      id: 3,
      type: 'image',
        url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/4.jpg'
    }, {
      id: 4,
      type: 'image',
        url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/5.jpg'
    }, {
      id: 5,
      type: 'image',
        url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/6.jpg'
    }, {
      id: 6,
      type: 'image',
        url: 'https://chl-1259104033.cos.ap-chengdu.myqcloud.com/7.jpg'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '请等待',
    })
    let that = this;
    Promise.all([
      //获取全部找失物数据
      createPromise("findGoodsSort", 0, '全部'),
      //获取大类找失主数据
      createPromise("findOwnerSort", 0, '全部')
    ]).then(function(res) {
      let [data1, data2] = res;
      //处理data1的时间过滤
      data1 = timeGroupFilter(data1);
      that.setData({
        dataList: data1.data
      })
      //处理data2的时间过滤
      data2 = timeGroupFilter(data2);

      wx.hideLoading();
      let json_obj = {
        "findOwnerSort": data2.data,
        "findGoodsSort": data1.data,
        "findOwnerSortPage": query_number,
        "findGoodsSortPage": query_number
      }
      wx.setStorage({
        key: '全部',
        data: json_obj,
      })
      console.log("全部--存入缓存成功")
    })
  },
  onShow: function() {
    if (app.globalData.isRefresh) {
      this.onLoad();
      app.globalData.isRefresh=false;
    }
  },
  //下拉触顶刷新数据
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '获取最新信息',
    })
    console.log("我已经到顶了");
    var that = this;
    let kind = this.data.bigKind;

    //寻找失物
    if (this.data.selected) {
      wx.request({
        url: url + 'findGoodsSort',
        data: {
          page: 0,
          kind: kind
        },
        success: function(res) {
          console.log(res.data)
          //时间过滤
          res = timeGroupFilter(res);
          that.setData({
            dataList: res.data
          })
          wx.stopPullDownRefresh();
          wx.hideLoading();
          //修改缓存
          try {
            let value = wx.getStorageSync(kind);
            value.findGoodsSort = res.data;
            value.findGoodsSortPage = query_number;
            wx.setStorage({
              key: kind,
              data: value
            })
          } catch (e) {
            console.log(e)
          }
        }
      })
    } else {
      //归还失物
      wx.request({
        url: url + 'findOwnerSort',
        data: {
          page: 0,
          kind: kind
        },
        success: function(res) {
          console.log(res.data)
          //时间过滤
          res = timeGroupFilter(res);
          that.setData({
            dataList: res.data
          })
          wx.stopPullDownRefresh();
          wx.hideLoading();
          //修改缓存
          try {
            let value = wx.getStorageSync(kind);
            value.findOwnerSort = res.data;
            value.findOwnerSortPage = query_number;
            wx.setStorage({
              key: kind,
              data: value
            })
          } catch (e) {
            console.log(e)
          }
        }
      })

    }

  },
  //上拉触底刷新数据
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log("到达底部");
    let kind = this.data.bigKind;
    console.log(kind)
    try {
      let value = wx.getStorageSync(kind);
      if (this.data.selected) {
        wx.request({
          url: url + 'findGoodsSort',
          data: {
            page: value.findGoodsSortPage,
            kind: kind
          },
          success: function(res) {
            if (res.data.length == 0) {
              Toast();
              return;
            }

            //时间过滤
            res = timeGroupFilter(res);

            console.log("更新数据");
            let newData = value.findGoodsSort.concat(res.data);
      

            that.setData({
              dataList: newData
            })

            wx.hideLoading()

            //更新缓存
            let page = value.findGoodsSortPage + query_number;
            value.findGoodsSort = newData;
            value.findGoodsSortPage = page;
            wx.setStorage({
              key: kind,
              data: value
            })
            console.log("更新缓存")
          }
        })
      } else {
        wx.request({
          url: url + 'findOwnerSort',
          data: {
            page: value.findOwnerSortPage,
            kind: kind
          },
          success: function(res) {
            if (res.data.length == 0) {
              Toast();
              return;
            }
            //时间过滤
            res = timeGroupFilter(res);
            console.log("更新数据");
            let newData = value.findOwnerSort.concat(res.data);
            
            that.setData({
              dataList: newData
            })

            wx.hideLoading()

            //更新缓存
            let page = value.findOwnerSortPage + query_number;
            value.findOwnerSort = newData;
            value.findOwnerSortPage = page;
            wx.setStorage({
              key: kind,
              data: value
            })
            console.log("更新缓存")
          }
        })
      }
    } catch (e) {
      console.log(e);
    }
  },
  //切换寻找失物
  selected_btn1: function() {
    if (!this.data.selected) {
      let kind = this.data.bigKind;
      console.log(kind + "切换到寻找失物");
      //按照大类读取缓存
      try {
        let value = wx.getStorageSync(kind)
        this.setData({
          selected: true,
          dataList: value.findGoodsSort
        })
      } catch (e) {
        console.log("读取缓存失败");
      }
    }
  },
  //切换归还失物
  selected_btn2: function() {
    if (this.data.selected) {
      let kind = this.data.bigKind;
      console.log(kind + "切换到归还失物");
      //按照大类读取缓存
      try {
        let value = wx.getStorageSync(kind)
        this.setData({
          selected: false,
          dataList: value.findOwnerSort
        })
      } catch (e) {
        console.log("读取缓存失败");
      }
    }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
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
  //选择大类
  bigKind_change: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var bigKind = e.currentTarget.dataset.bigkind;
    console.log("大类：" + bigKind);
    this.setData({
      bigKind: bigKind,
      modalName: null
    })

    //判断是否有此key(大类)，以便缓存
    try {
      const res = wx.getStorageInfoSync()
      let haveKey = false; //是否拥有key(大类)
      for (let i = 0; i < res.keys.length; i++) {
        if (res.keys[i] == bigKind) {
          haveKey = true;
          break;
        }
      }
      //有此大类 读取缓存直接渲染
      if (haveKey) {
        console.log("缓存中有此大类")
        try {
          let list = wx.getStorageSync(bigKind);
          if (that.data.selected) {
            console.log(list.findGoodsSort)
            that.setData({
              dataList: list.findGoodsSort
            })
          } else {
            console.log(list.findOwnerSort)
            that.setData({
              dataList: list.findOwnerSort
            })
          }
          wx.hideLoading();
        } catch (e) {
          console.log(e);
        }

      } else {
        console.log("缓存中没有此大类")
        //没有此大类  请求数据 并且缓存数据
        let json_obj = {
          "findOwnerSort": "",
          "findGoodsSort": "",
          "findOwnerSortPage": query_number,
          "findGoodsSortPage": query_number
        };

        Promise.all([
          //获取大类找失物数据
          createPromise("findGoodsSort", 0, that.data.bigKind),
          //获取大类找失主数据
          createPromise("findOwnerSort", 0, that.data.bigKind)
        ]).then(function(res) {
          let [data1, data2] = res;
          //时间过滤
          data1 = timeGroupFilter(data1);
          data2 = timeGroupFilter(data2);

          if (that.data.selected) {
            that.setData({
              dataList: data1.data
            })
          } else {
            that.setData({
              dataList: data2.data
            })
          }
          wx.hideLoading();

          json_obj.findGoodsSort = data1.data;
          json_obj.findOwnerSort = data2.data;
          //存入缓存
          wx.setStorage({
            key: that.data.bigKind,
            data: json_obj,
          })
          console.log("存入缓存成功")
        })

      }
    } catch (e) {
      console.log(e)
    }
  },
  info_detail: function(e) {
    let id = e.currentTarget.dataset.id;
    let bigkind = e.currentTarget.dataset.bigkind;
    console.log(e)
    wx.navigateTo({
      url: '/pages/main/single/single?id=' + id + '&bigkind=' + bigkind,
    })
  }
})