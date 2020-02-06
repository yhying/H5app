window.addEventListener('DOMContentLoaded', function() {
    if (!((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent))) {
        document.documentElement.innerHTML = "<p>请使用手机打开此页面哦~</p>";
    }
});
 if($(window).width() > 460){
 	document.documentElement.innerHTML = "<p>请使用手机打开此页面哦~</p>";
 }
//接口域名
const baseUrl = 'http://qiangli.xmtzxm.com.cn';
//图片路径
const ImgUrl = 'http://qiangli.xmtzxm.com.cn/upload/';
// 获取当前使用的浏览器
function getExplorer() {
	var explorer = window.navigator.userAgent;
	//ie
	if(explorer.indexOf("MSIE") >= 0) {
		return 'ie';
	}
	//firefox火狐浏览器
	else if(explorer.indexOf("Firefox") >= 0) {
		return 'Firefox';
	}
	//Chrome谷歌浏览器
	else if(explorer.indexOf("Chrome") >= 0) {
		return 'Chrome';
	}
	//Opera欧朋浏览器
	else if(explorer.indexOf("Opera") >= 0) {
		return 'Opera';
	}
	//Safari苹果浏览器
	else if(explorer.indexOf("Safari") >= 0) {
		return 'Safari';
	}
}
//const Explorer = getExplorer();
//console.log('当前使用的浏览器为：'+Explorer);
//判断用户当前是在什么环境登录
get_userAgent();
function get_userAgent() {
	if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
		console.log('移动端');
		let u = navigator.userAgent;
		let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if(isAndroid) {
			console.log('安卓' + isAndroid);
		}
		if(isiOS) {
			console.log('苹果' + isiOS);
		}
	} else {
		console.log('PC端');
	}
}

//清除空格-------通过原型创建字符串的trim()
String.prototype.trim = function() {
	return this.replace(/\s+/g, "");
}
//获取地址跳转参数
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串 
	console.log(url);
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/*
 * 数据传递函数：encryptData
 * name:存入本地的名字
 * data:存入数据
 */
function encryptData(name, data) {
	let newsData = JSON.stringify(data);
	window.localStorage.setItem(name, window.btoa(newsData));
}
/*
 * 接收传递数据函数：decodeData
 * name:取出数据的名字
 */
function decodeData(name) {
	if(window.localStorage.getItem(name)) {
		let newsData = window.localStorage.getItem(name);
		newsData = window.atob(newsData);
		//	window.localStorage.removeItem(name);
		if(newsData) {
			return JSON.parse(newsData);
		} else {
			return false;
		}
	} else {
		return false;
	}

}

var fun = function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;

            //这里是假设在640px宽度设计稿的情况下，1rem = 20px；
            //可以根据实际需要修改
            docEl.style.fontSize = 20 * (clientWidth / 640) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}
fun(document, window);
/*
* 禁止屏幕横屏
*/
mui.plusReady(function () { 
	plus.screen.lockOrientation("portrait-primary"); 
}); 