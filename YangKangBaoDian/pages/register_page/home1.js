// index.js
// const app = getApp()
const app = getApp()

Page({
  data: {
    
  },

  onSubmit: function (e) {
    console.log(e.detail.value);
    var that= this
    wx.request({
        // url: 'http://127.0.0.1:5000/cms/user/register', 
        url: 'http://192.168.137.1:5000/cms/user/register', 
        method: 'POST',
        data: {
          username: e.detail.value.username,
          password: e.detail.value.password,
          confirm_password: e.detail.value.confirm_password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:function(res) {
            var obj = res.data
                console.log(obj)
                if(obj.code == 10030) {
                    wx.showToast({
                        title: JSON.stringify(obj.message),
                        icon: 'error'
                    });
                }else if(obj.code == 10071) {
                    wx.showToast({
                        title: JSON.stringify(obj.message),
                        icon: 'error'
                    });
                }else {
                    wx.showToast({
                        title: '注册成功',
                        icon: 'success'
                    })
                }
        }
    })
  },

  toLogin(e) {
    wx.reLaunch({
      url:'/pages/login_page/login',
    });
  }
});