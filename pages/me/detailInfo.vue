<template>
	<view>
		<form>
			<view class="cu-form-group margin-top me-padding" @click="changeAvater">
				<view class="title">头像</view>
				<image src="../../static/icons/right.png" class="me-right me-right-rpx"></image>
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">昵称：</view>
				<input name="input" v-model="wxUser.nickName" placeholder="昵称" />
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">性别</view>
				<!-- 自定义选择器 -->
				<picker mode="selector" :range="sexSelector" @change="sexChanged">
					<view class="picker">{{wxUser.sex}}</view>
				</picker>
			</view>
			<view class="cu-form-group me-padding">
				<view class="title">所在地</view>
				<!-- 地区选择器 -->
				<picker mode="region" @change="regionChanged">
					<view class="picker">{{wxUser.location}}</view>
				</picker>
			</view>
		</form>
		<!-- <view class="me-content">
			<view class="me-content-item" @click="changeAvater">
				<text>头像</text>
			</view>
			<view class="me-content-item">
				<text>昵称：</text>
				<input v-model="wxUser.nickName" />
			</view>
			<view class="me-content-item">
				<text>性别：</text>
				<picker mode="selector" :range="sexSelector" @change="sexChanged">{{wxUser.sex}}</picker>
			</view>
			<view class="me-content-item me-no-border">
				<text>所在地：</text>
				<picker mode="region" @change="regionChanged">{{wxUser.location}}</picker>
			</view>
		</view> -->
		<view class="confirmButton" @click="confirm">
			<text>保存</text>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				sexSelector: ['男', '女'],
				wxUser: {
					id: '',
					nickName: '',
					sex: '请选择性别',
					location: '请选择所在地'
				}
			}
		},
		onLoad: function() {
			_self = this;
			uni.getStorage({
				key: 'wxUser',
				success: function(res) {
					_self.wxUser.id = res.data.id;
					_self.wxUser.nickName = res.data.nickName;
					if (res.data.sex) _self.wxUser.sex = res.data.sex;
					if (res.data.location) _self.wxUser.location = res.data.location;
				}
			})
		},
		methods: {
			//跳转到头像修改界面
			changeAvater: function() {
				uni.navigateTo({
					url: "./avater"
				})
			},
			//性别改变
			sexChanged: function(e) {
				this.wxUser.sex = this.sexSelector[e.detail.value];
			},
			//出生日期改变
			dateChanged: function(e) {
				this.bornDate = e.detail.value;
			},
			//所在地改变
			regionChanged: function(e) {
				this.wxUser.location = e.detail.value.join(',');
			},
			//确定修改
			confirm: function() {
				_self = this;
				if (_self.wxUser.nickName == "") {
					uni.showToast({
						title: '昵称不能为空',
						icon: 'none',
						mask: true
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '您确定要修改吗？',
						success: function(res) {
							if (res.confirm) {
								uni.showLoading({
									title: '正在修改中',
									mask: true,
									success: function() {
										//请求修改用户信息
										uni.request({
											url: getApp().globalData.baseUrl + 'api/wxUser',
											method: 'PUT',
											data: _self.wxUser,
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
														//更新缓存
														uni.getStorage({
															key: 'wxUser',
															success: function(res3) {
																res3.data.nickName = _self.wxUser.nickName;
																res3.data.sex = _self.wxUser.sex;
																res3.data.location = _self.wxUser.location;
																uni.setStorage({
																	key: 'wxUser',
																	data: res3.data,
																	success: function() {
																		//修改上一页的数据
																		var pages = getCurrentPages();
																		var prevPage = pages[pages.length - 2].setData({
																			nickName: _self.wxUser.nickName
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
												uni.showToast({
													title: '修改失败',
													duration: 1500,
													icon: 'none',
													mask: true,
													success: function() {}
												})
											},
											complete: function() {}
										});
									}
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	.confirmButton {
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		height: 80rpx;
		width: 280rpx;
		position: relative;
		top: 500rpx;
		background-color: #FFA000;
		border-radius: 20rpx;
		color: #fff;
	}
	
	.cu-form-group .title {
	min-width: calc(4em + 10px);
	}

</style>
