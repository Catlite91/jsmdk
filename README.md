## Usage

### Description
	
	hybrid app 前端工具箱
	
## Example

```javascript
// 调用对话框
SirM.alert('弹出我吧');
```

## API

所有的方法都是全局对象SirM的成员方法或属性

----

1. alert: 消息确认框

	`alert(msg)`: void
	
	`msg<String>`: 提醒输入的字符串

2. confirm: 对话框
	
	`confirm(msg,callback)`: void
	
	`msg<String>`: 确认操作的提示文案
	
	`callback<Function>`: 执行操作后的回调函数，result中包含操作结果
	
		result<Object>: 
			isConfirm<Boolean>: 是否确认，true表示确认，false表示取消
			data<Array>: 返回的数据，非必须
		

3. toast: 提醒信息，淡入淡出效果

	`toast(msg[,duration])`: void
	
	`msg<String>`: 提醒输入的字符串
	
	`duration<Number>`: 支持时间,默认为3s,可空
	

4. getIMEI: 获取设备Id

	`getIMEI()`: void

5. getOS: 获取系统信息

	`getOS()`: return object
	
		result<Object>: 
		os<String>: andriod | ios
		version<Number>: android(2.2~4.4) | ios(...)

6. finish: 完成，页面生命周期结束，视图实例被注销
	
	`finish()`: void

7. swipeView: 视图切换(h5-to-native)

	`swipeView(view)` void
	view<String>: 视图对应的页面，映射关系需要android应用绑定

8. getNetworkType: 获取网络类型
	
	`getNetworkType()` return object
	view<String>: 视图对应的页面，映射关系需要android应用绑定
	
		result<Object>:
		isWifi<Boolean>: 是否是wifi环境
		type<String>: 值可能的类型包括'4G','3G','2G','GPRS','Wifi','DSL'等

## License
### [MIT License](https://en.wikipedia.org/wiki/MIT_License)
