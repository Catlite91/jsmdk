## Usage

### Version
	
	stable: 0.0.1
	develop: 0.0.1

### Description
	
hybrid app 前端工具箱
* 工具箱涵盖了andriod版本和ios版本
* 客户端请在本地载入jdk文件, `build>sirm-android-min.js`, 如果IOS无法在本地载入该文件, 请h5相关的前端开发人员通过`<script>`标签载入, 版本请参考#Version, 具体地址为：

	http://`{domain}`/jsmdk/`{version}`/build/sirm-`{os}`-min.js

	请替换`{domain}`为线上环境:`s1.laoshilaile.cn/assets-ls`,测试环境: `192.168.1.204:8081` `{version}`为对应的版本号,`{os}`为对应系统名称
	
## Example

```javascript
所有方法都是异步调用方式
所有方法的第一个参数若为function, 则被视为回调函数  该参数不能为undefined或者null!!
若参数不能确定, 一定要将第一个参数设成回调函数以免影响真实参数


/**
 * 调用对话框
 */
SirM.alert('弹出我吧');

/**
 * 确认对话框
 */
SirM.confirm('确认对话框',function(result) {
	// 如果存在返回数据
	if (data) {
		// 数据处理
	}
	if (result.isConfirm) {
		// 确认之后做什么事情
	} else {
		// 取消之后做什么事情
	}
});

/**
 * 消息提醒
 */
SirM.toast('消息提醒');
SirM.toast('5秒之后退出消息框', 5);

/**
 * 获取设备ID
 */
SirM.getIMEI(function(req, rst){
	alert(rst)
});


/**
 * 获取系统信息
 */
SirM.getOS(function(){
	alert(rst)
});

/**
 * 关闭当前页面或回到上个页面
 */
button.on('click', function() {
	// form.submit();
	// 关闭当前页面|回到上个页面
	SirM.finish();
})

/**
 * 切换视图
 */
//去老师详情页
button.on('click', function() {
	var tId = this.attr('teacherId'),
		_token_ = this.form._token_.value;

	SirM.swipeView('teacherView', {
		teacherId: tId,
		token: _token_
	});
})

/**
 * 判断网络类型
 */
button.on('click', function() {
	var netType = SirM.getNetworkType('弹出我吧');
	if (netType.hasOwnProperty('isWifi') && netType.isWifi) {
		// download apk
	}
})

```

## API

所有的方法都是全局对象SirM的成员方法或属性

----

1. alert: 消息确认框

	`alert(msg)`: void
	
	`msg<String>`: 提醒输入的字符串

2. confirm: 对话框
	
	`confirm(msg,callback)`: 无返回值
	
	`msg<String>`: 确认操作的提示文案
	
	`callback<Function>`: 执行操作后的回调函数，result中包含操作结果
	
	`callback RETURN<Object>`:

		isConfirm<Boolean>: 是否确认，true表示确认，false表示取消
		data<String|Array|Object>: 返回的数据，非必须
		

3. toast: 提醒信息，淡入淡出效果

	`toast(msg[,duration])`: 无返回值
	
	`msg<String>`: 提醒输入的字符串
	
	`duration<Number>`: 动画持续时间,默认为3s,可空
	

4. getIMEI: 获取设备Id

	`RETURN <Number>`: 

		返回设备Id给业务层，会对native端返回的类型做强制转化为Number 

5. getOS: 获取系统信息

	`RETURN <Object>`: 

		os<String>: andriod | ios
		version<Number>: android(2.2~4.4) | ios(6.0~9.4) 返回具体的版本号，会对native端返回的字符串或浮点型做强制转化为float给上层应用

6. finish: 完成，页面生命周期结束，视图实例被注销
	
	`finish()`: void 无返回值

7. swipeView: 视图切换(h5-to-native)

	`swipeView(view[, extra])` 无返回值
	
	`view<String>`: 视图对应的页面，映射关系需要android应用绑定
	
	`extra<Object>`: 扩展数据，调用native需要额外传递的参数，类型为object, key/value不做限定，业务线自己根据需求自己拼装对象

8. getNetworkType: 获取网络类型
	
	`getNetworkType()` return object | similar object string 上层业务获得Object
	
	`view<String>`: 视图对应的页面，映射关系需要android应用绑定
	
	`RETURN <Object>`:

		isWifi<Boolean>: 是否是wifi环境
		type<String>: 值可能的类型包括'4G','3G','2G','GPRS','Wifi','DSL'等

## License
### [MIT License](https://en.wikipedia.org/wiki/MIT_License)
