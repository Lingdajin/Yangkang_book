# **Yangkang_book**
A bbs based on miniprogram
---
## 硬件准备
* ESP8266NodeMcu
* oled液晶屏
* 按钮
* 有源蜂鸣器
* 杜邦线若干
* 面包板

## 端到端系统
* 魔改lin-cms后端服务器
* MYSQOL数据库

## 小程序
* 请见YangKangBaoDian文件夹

## ESP8266代码
* 请见Timer内文件
* 使用arduinoIDE编写
---
## 构建步骤
1. 使用微信小程序开发者工具导入YangKangBaoDian小程序，先放在一边，暂时使用不到
2. 将ESP硬件按图示连接

![image](https://github.com/Lingdajin/Yangkang_book/blob/main/handwriting.PNG)

4. 将ESP8266与电脑连接，下载arduinoIDE并连接
5. 用IDE打开下载的Timer.ino文件，对其中SSID和PASSWORD修改为自己的WIFI名和密码
6. 点击上传，注意，对ESP8266进行烧录时需要长按FLASH并按一下RST，烧录过程中保持FLASH按钮不松
7. 烧录成功后应该会看到oled亮起，第一行时间在等待连接WIFI后自动刷新为当前时间，第二行默认为100
8. 下载starter后，进入STARTER目录，在本目录下打开powershall（注意，需提前下载好nodejs和npm和MYSQL）输入命令：npm run start:dev,待出现listening at http://localhost:5000后即为打开后端成功
9. 将微信小程序中的所有js文件里所有wx.request{url:''}改为自己的ip地址，在电脑测试时应为http://127.0.0.1:5050
10. 编译小程序就应该可以使用了

