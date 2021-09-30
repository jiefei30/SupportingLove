import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;

//封装uni的跳转方法,参数为页面路径,保留当前页面,可返回,但不能跳转到tabBar的页面
Vue.prototype.unito = function(url) {
	uni.navigateTo({
		url: url
	});
};

//封装uni的返回方法,参数为返回页数
Vue.prototype.uniback = function(number) {
	uni.navigateBack({
		delta: number
	});
};

//时间戳转日期,参数为时间戳
Vue.prototype.timestampToDate = function(unixtimestamp) {
	var unixtimestamp = new Date(unixtimestamp);
	var year = 1900 + unixtimestamp.getYear();
	var month = "0" + (unixtimestamp.getMonth() + 1);
	var date = "0" + unixtimestamp.getDate();
	return (
		year +
		"-" +
		month.substring(month.length - 2, month.length) +
		"-" +
		date.substring(date.length - 2, date.length)
	);
};

//时间戳转日期,参数为时间戳
Vue.prototype.timestampToDatePlus = function(unixtimestamp) {
	var unixtimestamp = new Date(unixtimestamp);
	var year = 1900 + unixtimestamp.getYear();
	var month = "0" + (unixtimestamp.getMonth() + 1);
	var date = "0" + unixtimestamp.getDate();
	var hour = "0" + unixtimestamp.getHours();
	var minute = "0" + unixtimestamp.getMinutes();
	var second = "0" + unixtimestamp.getSeconds();
	return (
		year +
		"-" +
		month.substring(month.length - 2, month.length) +
		"-" +
		date.substring(date.length - 2, date.length) +
		" " +
		hour.substring(hour.length - 2, hour.length) +
		":" +
		minute.substring(minute.length - 2, minute.length) +
		":" +
		second.substring(second.length - 2, second.length)
	);
};
//基本showToast方法封装
Vue.prototype.commonToast = function(title,icon,duration){
	uni.showToast({
	  title: title,
	  mask: true,
	  icon: icon,
	  duration: duration
	});
}


//服务器返回错误警报时,公共的showToast()方法
Vue.prototype.errorToast = function(res) {
	var msg;
	if (!res) msg = "";
	else if (res.data.message) msg = res.data.status + " : " + res.data.message;
	else msg = res.statusCode + " : " + res.data;
	uni.showToast({
		title: "错误 " + msg,
		mask: true,
		icon: "none",
		duration: 2000
	});
};
//显示成功的showToast()方法
Vue.prototype.successToast = function(msg) {
	if (!msg) msg = "";
	uni.showToast({
		title: "成功" + msg,
		mask: true,
		duration: 2000
	});
};

App.mpType = "app";

const app = new Vue({
	...App
});

app.$mount();
