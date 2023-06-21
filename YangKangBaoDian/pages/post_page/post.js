// pages/post_page/post.js
Page({

    data: {
        title:null,
        text:null,
        author:null
    },

    onLoad(options) {

    },

    bindText(e){
        //console.log(e.detail.value)
        this.setData({
            title:e.detail.value
        })
    },

    bindTextAreaBlur(e){
        //console.log(e.detail.value)
        this.setData({
            text:e.detail.value
        })
    },

    send(e){
        var that= this
        wx.request({
        //   url: 'http://127.0.0.1:5000/v1/book/',
        url: 'http://192.168.137.1:5000/v1/book/', 
          method:'POST',
          data:{
            title:that.data.title,
            summary:that.data.text,
            author:wx.getStorageSync('username'),
            image:'none',
          },
          header: {
            'Authorization': 'Bearer '+wx.getStorageSync('token')
        },
        success (res) {
            var obj= res.data
            console.log(obj)
            if(obj.code== 10000){
                wx.showToast({
                  title: '您还没有登陆',
                  icon: 'error'
                })
            }else if(obj.code== 10030){
                wx.showToast({
                    title: JSON.stringify(obj.message),
                    icon: 'error'
                  })
            }else if(obj.code== 10240){
                wx.showToast({
                  title: JSON.stringify(obj.message),
                  icon: 'error'
                })
            }
            else{
                wx.showToast({
                    title: '发送成功',
                    icon: 'success'
                  })
            }
            
        }
        })
    }

})