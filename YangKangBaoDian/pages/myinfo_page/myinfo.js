// pages/myinfo_page/myinfo.js
Page({

    data: {
        welcome:null,
    },

    onLoad(options) {
        var that= this
        if(wx.getStorageSync('username')== 'null'){
            that.setData({
                welcome: '您还没有登陆哦'
            })
        }else{
            that.setData({
                welcome: '欢迎你'+wx.getStorageSync('username')
            })
        }
    },

    login(e){
        if(wx.getStorageSync('username')== 'null'){
            wx.reLaunch({
              url: '/pages/login_page/login',
            })
        }else{
            console.log(wx.getStorageSync('username'))
            wx.showToast({
              title: '您已经登录！',
              icon: 'error'
            })
        }
    },

    quit(e){
        wx.setStorageSync('username','null')
        wx.removeStorageSync('token')
        this.setData({
            welcome: '您还没有登陆哦'
        })
        wx.showToast({
          title: '退出成功！',
          icon: 'success'
        })

    },

    esp(e){
        wx.navigateTo({
          url: '/pages/clock/index',
        })
    }
})