#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
WiFiUDP ntpUDP;


//巴法云服务器地址默认即可
#define TCP_SERVER_ADDR "bemfa.com"
//服务器端口，tcp创客云端口8344
#define TCP_SERVER_PORT "8344"

#define DEFAULT_STASSID  "LAO_TIAN"     //WIFI名称，区分大小写，不要写错
#define DEFAULT_STAPSW   "12345678"  //WIFI密码
// 连接巴法云
String UID = "ea565388aea14b9088ebd3801e5488c0";  //用户私钥，可在控制台获取,修改为自己的UID
String TOPIC =   "timer";         //主题名字，可在控制台新建
//最大字节数
#define MAX_PACKETSIZE 512
//设置心跳值30s
#define KEEPALIVEATIME 60*1000
//tcp客户端相关初始化，默认即可
WiFiClient TCPclient;
String TcpClient_Buff = "";
unsigned int TcpClient_BuffIndex = 0;
unsigned long TcpClient_preTick = 0;
unsigned long preHeartTick = 0;//心跳
unsigned long preTCPStartTick = 0;//连接
bool preTCPConnected = false;

// 设置屏幕
U8G2_SSD1306_128X64_NONAME_1_SW_I2C u8g2(U8G2_R0, 14 , 5,   U8X8_PIN_NONE);   // All Boards without Reset of the Display
NTPClient timeClient(ntpUDP, "cn.ntp.org.cn", 8 * 60 * 60, 60000);

// String set_hours =  get.substring(0,2);
// String set_minutes = get.substring(3,5);

String setTime="10:00";
int button = 0;
int bee = 13;
int value = 1;
int judge;


//相关函数初始化
//连接WIFI
void doWiFiTick();
void startSTA();

//TCP初始化连接
void doTCPClientTick();
void startTCPClient();
void sendtoTCPServer(String p);


void set_time(String get);





void setup(void) {

  pinMode(bee, OUTPUT);
  pinMode(button, INPUT_PULLUP);

  Serial.begin(115200);
  Serial.println("Beginning...");
  timeClient.begin();
  Serial.println ( "网络时钟初始化完成" );
  u8g2.begin();  
}

void loop(void) {
  // wifi
  doWiFiTick();

// 网络获取时间
  timeClient.update();
  String nowtime = timeClient.getFormattedTime();
  // Serial.println(nowtime);
  String hours =  nowtime.substring(0, 2);
  String minutes = nowtime.substring(3, 5);
  String seconds = nowtime.substring(6, 8);
  // Serial.println(hours);
  // Serial.println(minutes);
  // Serial.println(seconds);
  
  // String time = setTime[0];
  // Serial.println(time);
  
  // const char *time0Hour = time.substring(0,2).c_str();
  // const char *time0Minute = time.substring(3,5).c_str();

  const char *hour = hours.c_str();
  const char *minute = minutes.c_str();
  const char *second = seconds.c_str();
  // Serial.println(time1);

// 在屏幕显示时间
  u8g2.firstPage();
  do {
    // u8g2.setFont(u8g2_font_ncenB10_tr);
    u8g2.setFont(u8g2_font_unifont_t_chinese2);
    u8g2.drawStr(30,15,hour);
    u8g2.drawStr(50,15,":");
    u8g2.drawStr(60,15,minute);
    u8g2.drawStr(80,15,":");
    u8g2.drawStr(90,15,second);
    u8g2.drawStr(10,30,setTime.substring(0,2).c_str());
    u8g2.drawStr(30,30,":");
    u8g2.drawStr(40,30,setTime.substring(3,5).c_str());
    // u8g2.drawStr(10,40,setTime[1]);
    // u8g2.drawStr(10,50,setTime[2]);
    // u8g2.drawStr(10,60,setTime[3]);
    // u8g2.drawStr(10,70,setTime[4]);
  } while ( u8g2.nextPage() );


  // 控制到达设置时间时启动蜂鸣
  if(value == 1){ //若没有按过按钮
    // if(strcmp(hours.c_str(),setTime.substring(0,2).c_str()) == strcmp(minutes.c_str(),setTime.substring(3,5).c_str())){
    if(hours.toInt() == setTime.substring(0,2).toInt() && minutes.toInt() == setTime.substring(3,5).toInt()){
      digitalWrite(bee,HIGH);
      Serial.println("Bee On");
      value=digitalRead(button);
      if(value == 0){
        digitalWrite(bee,LOW);
        Serial.println("Bee Stop");
        judge = minutes.toInt();
      }
    }
  }
  if(value == 0){ //按下按钮后判定一分钟内不再响铃
    if(minutes.toInt() == judge + 1){
      value = 1;
    }
  }


  // 连接tcp
  doTCPClientTick();
  
}


/*
  *发送数据到TCP服务器
 */
void sendtoTCPServer(String p){
  
  if (!TCPclient.connected()) 
  {
    Serial.println("Client is not readly");
    return;
  }
  TCPclient.print(p);
  Serial.println("[Send to TCPServer]:String");
  Serial.println(p);
  preHeartTick = millis();//心跳计时开始，需要每隔60秒发送一次数据
}

/*
  *初始化和服务器建立连接
*/
void startTCPClient(){
  if(TCPclient.connect(TCP_SERVER_ADDR, atoi(TCP_SERVER_PORT))){
    Serial.print("\nConnected to server:");
    Serial.printf("%s:%d\r\n",TCP_SERVER_ADDR,atoi(TCP_SERVER_PORT));
    
    String tcpTemp="";  //初始化字符串
    tcpTemp = "cmd=1&uid="+UID+"&topic="+TOPIC+"\r\n"; //构建订阅指令
    sendtoTCPServer(tcpTemp); //发送订阅指令
    tcpTemp="";//清空
    
    preTCPConnected = true;
    TCPclient.setNoDelay(true);
  }
  else{
    Serial.print("Failed connected to server:");
    Serial.println(TCP_SERVER_ADDR);
    TCPclient.stop();
    preTCPConnected = false;
  }
  preTCPStartTick = millis();
}

/*
  *检查数据，发送心跳
*/
void doTCPClientTick(){
 //检查是否断开，断开后重连
   if(WiFi.status() != WL_CONNECTED) return;

  if (!TCPclient.connected()) {//断开重连

  if(preTCPConnected == true){

    preTCPConnected = false;
    preTCPStartTick = millis();
    Serial.println();
    Serial.println("TCP Client disconnected.");
    TCPclient.stop();
  }
  else if(millis() - preTCPStartTick > 1*1000)//重新连接
    startTCPClient();
  }
  else
  {
    if (TCPclient.available()) {//收数据
      char c =TCPclient.read();
      TcpClient_Buff +=c;
      TcpClient_BuffIndex++;
      TcpClient_preTick = millis();
      
      if(TcpClient_BuffIndex>=MAX_PACKETSIZE - 1){
        TcpClient_BuffIndex = MAX_PACKETSIZE-2;
        TcpClient_preTick = TcpClient_preTick - 200;
      }
    }
    if(millis() - preHeartTick >= KEEPALIVEATIME){//保持心跳
      preHeartTick = millis();
      Serial.println("--Keep alive:");
      sendtoTCPServer("cmd=0&msg=keep\r\n");
    }
  }
  if((TcpClient_Buff.length() >= 1) && (millis() - TcpClient_preTick>=200))
  {//data ready
    TCPclient.flush();
    Serial.print("Rev string: ");
    TcpClient_Buff.trim(); //去掉首位空格
    Serial.println(TcpClient_Buff); //打印接收到的消息
    String getTopic = "";
    String getMsg = "";
    if(TcpClient_Buff.length() > 15){//注意TcpClient_Buff只是个字符串，在上面开头做了初始化 String TcpClient_Buff = "";
          //此时会收到推送的指令，指令大概为 cmd=2&uid=xxx&topic=light002&msg=off
          int topicIndex = TcpClient_Buff.indexOf("&topic=")+7; //c语言字符串查找，查找&topic=位置，并移动7位，不懂的可百度c语言字符串查找
          int msgIndex = TcpClient_Buff.indexOf("&msg=");//c语言字符串查找，查找&msg=位置
          getTopic = TcpClient_Buff.substring(topicIndex,msgIndex);//c语言字符串截取，截取到topic,不懂的可百度c语言字符串截取
          getMsg = TcpClient_Buff.substring(msgIndex+5);//c语言字符串截取，截取到消息
          Serial.print("topic:------");
          Serial.println(getTopic); //打印截取到的主题值
          Serial.print("msg:--------");
          Serial.println(getMsg);   //打印截取到的消息值
          // set_time(getMsg); //将获取到的时间转化为时、分，并存储起来
          setTime = getMsg;
   }

   TcpClient_Buff="";
   TcpClient_BuffIndex = 0;
  }
}



void startSTA(){
  WiFi.disconnect();
  WiFi.mode(WIFI_STA);
  WiFi.begin(DEFAULT_STASSID, DEFAULT_STAPSW);
}
/**************************************************************************
                                 WIFI
***************************************************************************/
/*
  WiFiTick
  检查是否需要初始化WiFi
  检查WiFi是否连接上，若连接成功启动TCP Client
  控制指示灯
*/
void doWiFiTick(){
  static bool startSTAFlag = false;
  static bool taskStarted = false;
  static uint32_t lastWiFiCheckTick = 0;

  if (!startSTAFlag) {
    startSTAFlag = true;
    startSTA();
    Serial.printf("Heap size:%d\r\n", ESP.getFreeHeap());
  }

  //未连接1s重连
  if ( WiFi.status() != WL_CONNECTED ) {
    if (millis() - lastWiFiCheckTick > 1000) {
      lastWiFiCheckTick = millis();
    }
  }
  //连接成功建立
  else {
    if (taskStarted == false) {
      taskStarted = true;
      Serial.print("\r\nGet IP Address: ");
      Serial.println(WiFi.localIP());
      startTCPClient();
    }
  }
}


// 将获取到的时间转化为时、分，并存储起来
void set_time(String get){
  
  // String set_hours =  get.substring(0,2);
  // String set_minutes = get.substring(3,5);
  // Serial.println(set_hours);
  // Serial.println(set_minutes);
  
  ESP.wdtFeed();
  
  // for(int i = 0;;i++){
  //   if(setTime[i]=="......"){
  //     setTime[i] = get.c_str();
  //     setTime[i+1] = "......";
  //     Serial.println(setTime[i]);
  //     break;
  //   }
  // }
}

