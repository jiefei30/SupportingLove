<template>
	<view>
		<image class="logo" :src="avatar"></image>
		<view class="text-area">
			<view class="me-content avatar-content">
				<view class="me-content-item avatar-text" @click="chooseImg(['album'])">
					<text>从相册选择照片</text>
				</view>
				<view class="me-content-item avatar-text" @click="chooseImg(['camera'])">
					<text>拍照</text>
				</view>
				<view class="me-content-item avatar-text me-no-border" @click="avatarChanged">
					<text>修改</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				avatar: "../../static/icons/default-avatar.png",
				tempFilePaths:''
			}
		},
		onLoad() {
			_self = this;
			uni.getStorage({
				key:'wxUser',
				success:function(res){
					_self.avatar = res.data.avatar
				}
			})
		},
		methods: {
			//待定选择头像，参数只有两个，album只能从相册选取，camera只能拍摄
			chooseImg:function(methods){
				_self = this;
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					sourceType:methods,
				    success: (chooseImageRes) => {
				    _self.tempFilePaths = chooseImageRes.tempFilePaths[0];
					_self.avatar = _self.tempFilePaths;
					}
				});
			},
			//确定修改头像
			avatarChanged:function(){
				uni.showModal({
					title:'提示',
					content:'您确定要修改头像吗？',
					success:function(res){
						if(res.confirm)uni.showLoading({
							title:'正在修改中',
							mask:true,
							success:function(){
								uni.uploadFile({
								    url: 'http://localhost:8098/imdb_war/', 
								    filePath: _self.tempFilePaths,
								    name: 'file',
									header:{"Content-Type": "multipart/form-data"},
								    formData:'',
								    success: (uploadFileRes) => {
										uni.hideLoading();
										uni.showToast({
											title:'修改成功',
											duration:1500,
											mask:true,
											success:function(){
												uni.navigateBack({})
											}
										})
								    },fail:function(res){
										uni.hideLoading();
										uni.showToast({
											title:'修改失败',
											duration:1500,
											icon:'none',
											mask:true,
											success:function(){}
										})
								    }
								});
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #FFF3DA;
		font-size: 32rpx;
	}
</style>

<style scoped>
	.logo {
		height: 300rpx;
		width: 300rpx;
		margin: 250rpx auto;
		border-radius: 50%;
		display: block;
	}

	.text-area {
		position: absolute;
		bottom: 20rpx;
		width: 100%;
	}
	.avatar-content{
		padding: 0;
	}
	.avatar-text{
		justify-content:center;
	}
</style>
