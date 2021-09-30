<template>
	<view class="me-body">
		<!-- 公共认证信息部分 -->
		<form>
			<view class="cu-form-group margin-top me-padding" v-if="(status!=3)" style="display: flex;justify-content: flex-start;">
				<view class="title">
					<image :src="noticeImg" class="me-noticeImg"></image>
				</view>
				<view :class="[{'me-notice-certificating':(status==0)},{'me-notice-success':(status==1)},{'me-notice-fail':(status==2)}]">
				{{authData.message}}
				</view>
			</view>
			<view :class="['cu-form-group','me-padding',{'margin-top':(status==3)}]">
				<view class="title">姓名：</view>
				<input name="input" v-model="authData.realName" :disabled="(status==1)" placeholder="请输入真实姓名" maxlength="32" />
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">性别</view>
				<picker mode="selector" :range="sexSelector" @change="sexChanged" :disabled="(status==1)">
					<view class="picker">{{authData.sex}}</view>
				</picker>
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">生日</view>
				<picker mode="date" start="1970-01-01" end="2020-01-01" @change="dateChanged" :disabled="(status==1)">
					<view class="picker">{{authData.birthData}}</view>
				</picker>
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">身份证：</view>
				<input name="input" v-model="authData.idCard" maxlength='18' type="idcard" :disabled="(status==1)" placeholder="请输入18位身份证号" />
			</view>
		</form>
		
		<!-- <view class="me-content certification-content">
			<view class="me-content-item me-notice" v-if="(status!=3)">
				<image :src="noticeImg" class="me-noticeImg"></image>
				<text :class="[{'me-notice-certificating':(status==0)},{'me-notice-success':(status==1)},{'me-notice-fail':(status==2)}]">
					{{authData.message}}</text>
			</view>
			<view class="me-content-item">
				<text>姓名：</text>
				<input v-model="authData.realName" :disabled="(status==1)" placeholder="请输入真实姓名" maxlength="32" />
			</view>
			<view class="me-content-item">
				<text>性别：</text>
				<picker mode="selector" :range="sexSelector" @change="sexChanged" :disabled="(status==1)">{{authData.sex}}</picker>
			</view>
			<view class="me-content-item">
				<text>生日：</text>
				<picker mode="date" start="1970-01-01" end="2020-01-01" @change="dateChanged" :disabled="(status==1)">{{authData.birthData}}</picker>
			</view>
			<view class="me-content-item me-no-border">
				<text>身份证号：</text>
				<input v-model="authData.idCard" maxlength='18' type="idcard" :disabled="(status==1)" placeholder="请输入18位身份证号" />
			</view>
		</view> -->

		<!-- 小学生 -->
		<form v-if="orientation == 0">
			<view class="cu-form-group margin-top me-padding">
				<view class="title">学校：</view>
				<input name="input" v-model="authData.school" :disabled="(status==1)" placeholder="请输入学校名称" maxlength="32" />
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">班级：</view>
				<input name="input" v-model="authData.classes" :disabled="(status==1)" placeholder="请输入所在班级" maxlength="32" />
			</view>
		</form>
		
		<!-- <view class="me-content" v-if="orientation == 0">
			<view class="me-content-item">
				<text>学校：</text>
				<input v-model="authData.school" :disabled="(status==1)" placeholder="请输入学校名称" maxlength="32" />
			</view>
			<view class="me-content-item me-no-border">
				<text>班级：</text>
				<input v-model="authData.classes" :disabled="(status==1)" placeholder="请输入所在班级" maxlength="32" />
			</view>
		</view> -->

		<!-- 大学生 -->
		<form v-if="orientation == 1">
			<view class="cu-form-group margin-top me-padding">
				<view class="title">学校：</view>
				<input name="input" v-model="authData.school" :disabled="(status==1)" placeholder="请输入学校名称" maxlength="32" />
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">专业：</view>
				<input name="input" v-model="authData.major" :disabled="(status==1)" placeholder="请输入专业名称" maxlength="32" />
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">班级：</view>
				<input name="input" v-model="authData.classes" :disabled="(status==1)" placeholder="请输入所在班级" maxlength="32" />
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">学号：</view>
				<input name="input" v-model="authData.stuNo" :disabled="(status==1)" placeholder="请输入学工号" maxlength="32" />
			</view>
		</form>
		
		<!-- <view class="me-content" v-if="orientation == 1">
			<view class="me-content-item">
				<text>学校：</text>
				<input v-model="authData.school" :disabled="(status==1)" placeholder="请输入学校名称" maxlength="32" />
			</view>
			<view class="me-content-item">
				<text>专业：</text>
				<input v-model="authData.major" :disabled="(status==1)" placeholder="请输入专业名称" maxlength="32" />
			</view>
			<view class="me-content-item">
				<text>班级：</text>
				<input v-model="authData.classes" :disabled="(status==1)" placeholder="请输入所在班级" maxlength="32" />
			</view>
			<view class="me-content-item me-no-border">
				<text>学号：</text>
				<input v-model="authData.stuNo" :disabled="(status==1)" placeholder="请输入学工号" maxlength="32" />
			</view>
		</view> -->

		<!-- 大学生解答科目选择 -->
		<view class="cu-form-group margin-top me-padding" v-if="orientation == 1" @click="toMajor">
			<view class="title">解答科目：{{answerSubject}}</view>
			<image src="../../static/icons/right.png" class="me-right me-right-rpx" v-if="(status != 1)"></image>
		</view>
		
<!-- 		<view class="me-content" v-if="orientation == 1" @click="toMajor">
			<view class="me-content-item me-no-border">
				<text>解答科目：{{answerSubject}}</text>
				<image src="../../static/icons/right.png" class="me-right me-right-rpx" v-if="(status != 1)"></image>
			</view>
		</view>
 -->
		<view :class="['confirmButton',{'confirmButton-answer':(orientation == 0)}]" @click="confirm" v-if="(status != 1)">
			<text>{{btnText}}</text>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				answerSubject: "", //选择的科目
				sexSelector: ["男", "女"], //性别选择器的内容
				orientation: null, //身份
				status: 3, //认证状态，3为未认证
				btnText: '申请认证', //按钮信息
				errorText: 'ERROR', //当提交信息不规范时提示的内容
				noticeImg: '../../static/icons/horn-green.png', //顶层通告栏喇叭的图片（红、黄、绿）
				wxId: 0,
				//需要上传的authData
				authData: {
					realName: "",
					sex: "男",
					birthData: "2000-01-01",
					idCard: "",
					school: "",
					classes: "",
					major: "",
					stuNo: "",
					answerSubject: "",
					status: 3,
					message: ""
				}
			}
		},
		onLoad() {
			_self = this;
			//显示加载
			uni.showLoading({
				mask: true,
				success: function() {
					//取缓存
					uni.getStorage({
						key: 'wxUser',
						success: function(res) {
							_self.orientation = res.data.orientation //更新身份
							_self.wxId = res.data.id //更新微信用户id
							//如果填写过认证信息
							if (res.data.authData) {
								//先将时间戳转yyyy-mm-dd
								res.data.authData.birthData = _self.timestampToDate(res.data.authData.birthData)
								//修改全局变量中的answerSubject
								getApp().globalData.answerSubject = res.data.authData.answerSubject
								//修改该页中的answerSubject
								_self.answerSubject = res.data.authData.answerSubject
								//赋值该页的authData
								_self.authData = res.data.authData
								//修改该页的其他变量
								_self.btnText = "修改认证"
								_self.status = res.data.authData.status
								//如果认证状态0（认证中）
								if (_self.status == 0) {
									//先更改该页的喇叭图标
									_self.noticeImg = '../../static/icons/horn-yellow.png'
									//请求该用户的认证状态
									uni.request({
										url: getApp().globalData.baseUrl + 'api/authData/inquiry',
										data: {
											id: _self.wxId
										},
										method: 'GET',
										success: function(res2) {
											//如果不再是0（1或2）
											if (_self.status != res2.data.status) {
												//更新该页的数据
												_self.status = res2.data.status
												_self.message = res2.data.message
												//更新缓存数据
												res.data.authData.status = _self.status
												res.data.authData.message = _self.message
												//页面栈
												var pages = getCurrentPages();
												//如果认证成功了
												if (_self.status == 1) {
													_self.noticeImg = '../../static/icons/horn-green.png'
													var prevPage = pages[pages.length - 2].setData({
														status: 1
													})
												} else { //认证被驳回
													_self.noticeImg = '../../static/icons/horn-red.png'
													var prevPage = pages[pages.length - 2].setData({
														status: 2
													})
												}
												//把新的状态写入缓存
												uni.setStorage({
													key: 'wxUser',
													data: res.data,
													success: function() {
														uni.hideLoading()
													}
												})
											}else uni.hideLoading()
										},
										fail: function() {
											uni.hideLoading()
										}
									})
								} else if (_self.status == 2) { //如果状态为2
									_self.noticeImg = '../../static/icons/horn-red.png'
									uni.hideLoading()
								} else uni.hideLoading()
								_self.authData.message = res.data.authData.message
							}else uni.hideLoading()
						},
						fail: function(res) {
							uni.hideLoading()
						}
					})
				}
			})
		},
		onShow() {
			//将全局中的answerSubject赋值过来
			this.answerSubject = getApp().globalData.answerSubject
		},
		methods: {
			//性别变更
			sexChanged: function(e) {
				this.authData.sex = this.sexSelector[e.detail.value];
			},
			//生日变更
			dateChanged: function(e) {
				this.authData.birthData = e.detail.value;
			},
			//去科目选择页
			toMajor: function() {
				if (this.status != 1) 
				this.unito('./major')
			},
			//确定修改
			confirm: function() {
				this.authData.answerSubject = this.answerSubject
				//如果通过了正则判断
				if (this.regTest()) {
					uni.showModal({
						title: '提示',
						content: '您确定要提交吗？认证通过后不可更改',
						success: function(res) {
							if (res.confirm) uni.showLoading({
								title: '正在提交中',
								mask: true,
								success: function() {
									//修改该页的信息
									_self.btnText = "修改认证"
									_self.status = 0;
									_self.authData.status = 0;
									_self.authData.message = '正在认证中...'
									_self.noticeImg = '../../static/icons/horn-yellow.png'
									//新增和修改都为POST
									uni.request({
										method: 'POST',
										url: getApp().globalData.baseUrl + 'api/authData/put/' + _self.wxId,
										data: _self.authData,
										success: (res2) => {
											uni.hideLoading();
											uni.showToast({
												title: '修改成功',
												duration: 2000,
												mask: true,
												success: function() {
													//定时返回
													setTimeout(function() {
														_self.uniback(1)
													}, 1500);
													//写入（更新）缓存
													uni.getStorage({
														key: 'wxUser',
														success: function(res) {
															res.data.authData = _self.authData;
															uni.setStorage({
																key: 'wxUser',
																data: res.data,
																success: function() {
																	console.log(res.data)
																	//修改上一页的数据
																	var pages = getCurrentPages();
																	var prevPage = pages[pages.length - 2].setData({
																		status: _self.status
																	})
																}
															})
														}
													})
												}
											})
										},
										fail: function(res2) {
											uni.hideLoading();
											_self.commonToast('修改失败','none',1500)
										}
									});
								}
							})
						}
					})
				} else {
					_self.commonToast(_self.errorText,'none',1500)
				}
			},
			//表单校验部分
			regTest: function() {
				var authData = _self.authData;
				//除所有空格
				for (let i in _self.authData) {
					authData[i] = authData[i].toString().replace(/\s+/g, "");
				}
				//检测是否填写完整
				if ((!_self.authData.realName) || (_self.authData.idCard.length != 18)) {
					_self.errorText = '请将信息填写完整'
					return false;
				}
				if (_self.orientation) {
					if ((!_self.authData.school) || (!_self.authData.classes) || (!_self.authData.major) ||
						(!_self.authData.stuNo) || (!_self.authData.answerSubject)) {
						_self.errorText = '请将信息填写完整'
						return false;
					}
				} else {
					if ((!_self.authData.school) || (!_self.authData.classes)) {
						_self.errorText = '请将信息填写完整'
						return false;
					}
				}
				//判断输入名称是否合格
				var name = _self.authData.realName;
				var ren = /^[\u4e00-\u9fa5]{2,5}$/
				if (!ren.test(name)) {
					_self.errorText = "请填写正确的中文姓名";
					return false;
				}
				return true;
			}
		}
	}
</script>

<style>
	.certification-content {
		margin-top: 40rpx;
	}

	.confirmButton {
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		margin-top: 70rpx;
		margin-bottom: 70rpx;
		height: 80rpx;
		width: 280rpx;
		background-color: #FFA000;
		border-radius: 20rpx;
		color: #fff;
	}
	
	.confirmButton-answer{
		margin-top: 300rpx;
	}

	.me-noticeImg {
		width: 50rpx;
		height: 50rpx;
		margin-top: 5rpx;
	}

	.me-notice-success {
		color: #1afa29;
	}

	.me-notice-certificating {
		color: #FFC107;
	}

	.me-notice-fail {
		color: #d81e06;
	}
	.cu-form-group .title {
	min-width: calc(4em + 12px);
	}
</style>
