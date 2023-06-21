// pages/allshudong_page/allshudong.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array:[]
    },

    onLoad(options) {
        var that= this
        wx.request({
            //url: 'http://127.0.0.1:5000/v1/book/', 
            url: 'http://192.168.137.1:5000/v1/book/', 
            method:'GET',
            data: {
              //无
            },
            header: {
                'Authorization': 'Bearer '+wx.getStorageSync('token')
            },
            success (res) {
              console.log(res.data)
              that.setData({
                array: (res.data).reverse()
              })
            }
          })
    },

    onPullDownRefresh() {
        this.onLoad()
        wx.showToast({
          title: '刷新成功',
          icon: 'success'
        })
        wx.stopPullDownRefresh()
    },

    


})