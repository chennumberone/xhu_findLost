App({
  onLaunch: function() {
    let url = this.globalData.url;

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    //是否有openid的缓存
    var isOpenidHave = false;
    //清除数据缓存并查看是否有openid
    wx.getStorageInfo({
      success: function(res) {
        for (let i = 0; i < res.keys.length; i++) {
          //判断有openid
          if (res.keys[i] == 'openid') {
            isOpenidHave = true;
          }
          if (res.keys[i] != 'openid' && res.keys[i] != 'personalInfo' && res.keys[i] != 'msgNum') {
            wx.removeStorage({
              key: res.keys[i]
            })
          }
        }
        console.log("清楚数据缓存");

        if (!isOpenidHave) {
          console.log("云获取openid")
          // 获取用户唯一凭证
          wx.login({
            success(res) {
              let code = res.code;
              wx.request({
                url: url + 'getOpenid',
                method: 'get',
                data: {
                  code: code
                },
                success(res) {
                  let openid = res.data;
                  console.log("openid:" + openid);
                  wx.setStorage({
                    key: 'openid',
                    data: openid,
                  })
                },
                fail(res) {
                  console.log("获取唯一凭证失败")
                  console.log(res)
                }
              })
            }
          })
        }
      },
    })
  },
  globalData: {
    userInfo: null,
    url: 'https://www.xhufindlost.com:8080/xhu_findlost/',
    isRefresh: false, //是否刷新最新动态，用户发布过后刷新最新动态
  },
})