<template>
	<view id="content" @click="goToHome">
		<view id="logoView">
			<image id="logo" src="../../static/logo.png"></image>
		</view>
		<text id="title">爱心支教</text>
		<text id="slogan">沟通爱与心灵 传递教育力量</text>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {};
		},
		onLoad() {
			_self = this;
			/*
			 *  获取用户信息（未授权将进入fail）
			 */
			uni.getUserInfo({
				provider: 'weixin',
				success: function(infoRes) {
					//fail说明本地缓存没有该用户的信息
					uni.getStorage({
						key: 'wxUser',
						success: function() {
							//修改登录状态
							getApp().globalData.isLogin = true;
							// _self.commonToast('登陆成功','success',1500);
						},
						fail: function(storageRes) {
							//登录接口，得到code
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									//得到用户信息
									uni.request({
										url: getApp().globalData.baseUrl + 'wxAuth/login',
										method: 'POST',
										data: {
											"encryptedData": infoRes.encryptedData,
											"iv": infoRes.iv,
											'code': loginRes.code,
											'orientation': 0
										},
										success: (res) => {
											if (res.data.id) {
												//写入缓存
												uni.setStorage({
													key: 'wxUser',
													data: res.data,
													success: function() {
														//修改登录状态
														getApp().globalData.isLogin = true;
													}
												});
											} else {
												_self.errorToast(res)
											}
										},
										fail: function(res) {
											_self.errorToast(res)
										}
									});
								}
							});
						}
					})
				},
				fail: function(res) {
					_self.commonToast('用户未授权，将会自动跳到登录页','none',1500);
				}
			});
		},
		onReady() {
			setTimeout(function() {
				_self.goToHome();
			}, 3000);
		},
		methods: {
			goToHome: function() {
				uni.switchTab({
					url: '/pages/home/home'
				});
			}
		}
	};
</script>


<style>
	page {
		background-color: #FFC107;
	}
</style>
<style scoped>
	#content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#logoView {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 68rpx;
		margin-bottom: 82rpx;
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
		background-color: #ffffff;
	}

	#logo {
		width: 290rpx;
		height: 222rpx;
	}

	#title {
		font-size: 72rpx;
		color: #ffffff;
		margin-bottom: 64rpx;
	}

	#slogan {
		font-size: 44rpx;
		color: #ffffff;
		opacity: 0.87;
	}
</style>
