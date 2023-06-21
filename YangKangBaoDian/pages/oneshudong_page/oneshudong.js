// pages/oneshudong_page/oneshudong.js
Page({

    data: {
        id:null,
        author:null,
        title:null,
        summary:null,
        array:null,
        text:null,
        _id:null
    },

    onLoad(options) {
        var that= this
        this.setData({
            id:options.id
        })
        //console.log(this.data.id)
        // 获取帖子详细内容
        wx.request({            
            // url: 'http://127.0.0.1:5000/v1/book/'+that.data.id, 
            url: 'http://192.168.137.1:5000/v1/book/'+that.data.id, 
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
                title:res.data.title,
                author:res.data.author,
                summary:res.data.summary
              })
            }
          })
        //   获取评论
        wx.request({
          url: 'http://192.168.137.1:5000/treehole/reply/'+that.data.id,
          method: 'GET',
          data: {
            //无
          },
          success (res) {
              console.log(res)
              that.setData({
                  array:res.data
              })
          }
        })
    },

    // 下拉刷新
    onPullDownRefresh() {
        var that = this
        wx.request({            
            // url: 'http://127.0.0.1:5000/v1/book/'+that.data.id, 
            url: 'http://192.168.137.1:5000/v1/book/'+that.data.id, 
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
                title:res.data.title,
                author:res.data.author,
                summary:res.data.summary
              })
            }
          })
        //   获取评论
        wx.request({
          url: 'http://192.168.137.1:5000/treehole/reply/'+that.data.id,
          method: 'GET',
          data: {
            //无
          },
          success (res) {
              console.log(res)
              that.setData({
                  array:res.data
              })
          }
        })
        wx.showToast({
          title: '刷新成功',
          icon: 'success'
        })
        wx.stopPullDownRefresh()
    },

    // 删除帖子
    delete(e){
        var that= this
        wx.request({
        //   url: 'http://127.0.0.1:5000/v1/book/'+that.data.id,
        url: 'http://192.168.137.1:5000/v1/book/'+that.data.id,
          method: 'DELETE',
          data: {
              author:wx.getStorageSync('username')
          },
          header: {
            'Authorization': 'Bearer '+wx.getStorageSync('token')
        },
        success (res) {
            var obj= res.data
            console.log(obj)
            if(obj.code == 14){
                wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  })
            }else{
                wx.showToast({
                  title: JSON.stringify(obj.message),
                  icon: 'error'
                })
            }
            
          }
        })

        wx.request({
            url: 'http://192.168.137.1:5000/treehole/reply/all/'+that.data.id,
            method: 'DELETE',
            data: {
              author:wx.getStorageSync('username')
              },
              header: {
                  'Authorization': 'Bearer '+wx.getStorageSync('token')
              },
              success (res) {
                  var obj= res.data
                  console.log(obj)
                  if(obj.code== 14){
                      wx.showToast({
                          title: '删除成功',
                          icon: 'success'
                        })
                  }else{
                      wx.showToast({
                        title: JSON.stringify(obj.message),
                        icon: 'error'
                      })
                  }
                }
          })
    },

    // 删除评论
    deleteComment(e){
        var that = this
        console.log(e.target.dataset.index)
        this.setData({
            _id : e.target.dataset.index
        })
        wx.request({
          url: 'http://192.168.137.1:5000/treehole/reply/'+that.data._id,
          method: 'DELETE',
          data: {
            author:wx.getStorageSync('username')
            },
            header: {
                'Authorization': 'Bearer '+wx.getStorageSync('token')
            },
            success (res) {
                var obj= res.data
                console.log(obj)
                if(obj.code== 14){
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success'
                      })
                }else{
                    wx.showToast({
                      title: JSON.stringify(obj.message),
                      icon: 'error'
                    })
                }
              }
        })
        onPullDownRefresh() //删除评论后自动刷新
    },


    // 实时获取发送内容
    bindText(e){
        this.setData({
            text:e.detail.value
        })
    },

    // 发送评论
    send(e){
        var that = this
        wx.request({
          url: 'http://192.168.137.1:5000/treehole/reply/',
          method: 'POST',
          data:{
            author:wx.getStorageSync('username'),
            comment:that.data.text,
            image:'none',
            this_id:that.data.id
          },
          header: {
            'Authorization': 'Bearer '+wx.getStorageSync('token')
        },
        success (res){
            var obj= res.data
            console.log(obj)
            if(obj.code== 12){
                wx.showToast({
                    title: '发表评论成功',
                    icon: 'success'
                  })
            }else{
                wx.showToast({
                  title: JSON.stringify(obj.message),
                  icon: 'error'
                })
            }
        }
        })
    }

})