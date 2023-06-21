const app = getApp()

Page({
  data: {
    uid: 'ea565388aea14b9088ebd3801e5488c0',
    topic: "timer",
    device_status: "离线", //默认离线
    powerstatus:"已关闭",   //默认关闭
    time:"无",
    time1:"00",
    time2:"00",
    statusColor:"red"
  },

  onLoad: function () {
    var that = this

    //请求设备状态
    //设备断开不会立即显示离线，由于网络情况的复杂性，离线1分钟左右才判断真离线
    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/status/', //状态api接口，详见巴法云接入文档
      data: {
        uid: that.data.uid,
        topic: that.data.topic,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success (res) {
        console.log(res.data)
        if(res.data.status === "online"){
          that.setData({
            device_status:"在线",
            statusColor: "green"
          })
        }else{
          that.setData({
            device_status:"离线",
            statusColor: "red"
          })
        }
        console.log(that.data.device_status)
      }
    })

          //请求询问设备开关/状态
          wx.request({
            url: 'https://api.bemfa.com/api/device/v1/data/1/', //get接口，详见巴法云接入文档
            data: {
              uid: that.data.uid,
              topic: that.data.topic,
            },
            header: {
              'content-type': "application/x-www-form-urlencoded"
            },
            success (res) {
                console.log(res.data)
                that.setData({
                    powerstatus:res.data.msg
                })
              console.log(that.data.powerstatus)
            }
          })


    //设置定时器，每五秒请求一下设备状态
    setInterval(function () {
      console.log("定时请求设备状态,默认五秒");
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/status/',  //get 设备状态接口，详见巴法云接入文档
        data: {
          uid: that.data.uid,
          topic: that.data.topic,
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success (res) {
          console.log(res.data)
          if(res.data.status === "online"){
            that.setData({
              device_status:"在线",
              statusColor: "green"
            })
          }else{
            that.setData({
              device_status:"离线",
              statusColor: "red"
            })
          }
          console.log(that.data.device_status)
        }
      })

      //请求询问设备开关/状态
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/data/1/', //get接口，详见巴法云接入文档
        data: {
          uid: that.data.uid,
          topic: that.data.topic,
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success (res) {
          console.log(res.data)
          that.setData({
            powerstatus:res.data.msg
        })
          console.log(that.data.powerstatus)
        }
      })

    }, 5000)
  },


  openclick: function() {

    //当点击打开按钮，更新开关状态为打开
  var that = this
  that.setData({
    powerstatus:"已打开"
  })

      //控制接口
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/data/1/', //api接口，详见接入文档
        method:"POST",
        data: {  //请求字段，详见巴法云接入文档，http接口
          uid: that.data.uid,
          topic: that.data.topic,
          msg:that.data.time   //发送消息为on的消息
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success (res) {
          console.log(res.data)
          wx.showToast({
            title:'发送成功',
            icon:'success',
            duration:1000
          })
        }
      })
},

  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,
      time1:e.detail.value.slice(0, 2),
      time2:e.detail.value.slice(3, 5),
    })
  },
})
