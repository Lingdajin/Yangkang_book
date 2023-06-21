// pages/login/login.js

const app = getApp()
/*
wx.cloud.init({})
const db = wx.cloud.database().collection('Room')//初始化数据库 宏定义一个db指代Room表
*/
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    formSubmit(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        wx.request({
            // url: 'http://127.0.0.1:5000/cms/user/login', 
            url: 'http://192.168.137.1:5000/cms/user/login', 
            method: 'POST',
            data: {
              username: e.detail.value.username,
              password: e.detail.value.password
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success:function(res) {
                var obj = res.data
                console.log(obj)
                wx.setStorage({
                    key:"token",
                    data:obj.access_token
                })
                wx.setStorage({
                    key:"username",
                    data:e.detail.value.username
                })
                if(obj.code == 10031) {
                    wx.showToast({
                        title: '用户名或密码错误',
                        icon: 'error'
                    });
                }
                else if(obj.code == 10030) {
                    wx.showToast({
                        title: '用户名或密码不能为空',
                        icon: 'error'
                    });
                }
                else {
                    wx.showToast({
                        title: '登录成功',
                    })
                    wx.switchTab({
                        url: '/pages/allshudong_page/allshudong',
                    })
                }
            }
          })
      },


    toReg(){
        wx.navigateTo({
          url: '/pages/register_page/home1',
        })
    },


    youke(){{
        wx.switchTab({
            url: '/pages/allshudong_page/allshudong',
        })
    }}
})
