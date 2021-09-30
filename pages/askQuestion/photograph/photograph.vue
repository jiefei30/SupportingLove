<template>
	<view id="content">
		<form>
			<image id="cameraOutter" :src="questionsImg"></image> 
			<image id="camera" @click="setPhoto('camera')" src="../../../static/icons/cameraAsk.png" v-if="noPhoto"></image>
			<view id="buttons">
			<button id="photoAlbum" @click="setPhoto('album')">相册选择</button>
			<button id="reTakePhoto" @click="setPhoto('camera')"  v-if="!noPhoto">重新拍摄</button>
			<button id="submit" @click="uploadImg" v-if="!noPhoto">确认提交</button>
			</view>
		</form>
	</view>
</template> 

<script>
	export default {
		data() {
			return {
				noPhoto : true,
				questionsImg : ''
			}
		},
		methods: {
			setPhoto : function(msg){
				let _this = this;
				console.log(msg)
				uni.chooseImage({
				    count: 1, 
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [msg], //从相册选择
				    success: function (res) {
						_this.questionsImg = res.tempFilePaths[0]
						_this.noPhoto = false
				    }
				});
			},
			uploadImg : function(){
				let _this = this;
				// 获取缓存数据 - 登录user
				let user =  uni.getStorageSync('wxUser');
				// 再一次的身份的判断
				if(user.id == null || user.orientation != 0){
					uni.showModal({
						title: "警告",
						content: "用户身份不符"
					})
					return;
				}else if(_this.noPhoto || _this.questionsImg === ""){
					uni.showModal({
						title: "警告",
						content: "请选择问题图片"
					})
					return;
				}else{
					// 先上传图片，再上传问题
					 uni.uploadFile({
						// 文件上传地址
					    url: getApp().globalData.baseUrl + "api/file/upload-image", 
						// 文件
					    filePath: _this.questionsImg,
						// 身份验证
						header : {
							Authorization  : getApp().globalData.Authorization
						},
					    name: 'file',
						// 成功后执行问题上传
					    success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data)
							// 发送问题提交
							uni.request({
							    url: getApp().globalData.baseUrl + "api/question", 
								method: "POST",
								header: {
									// 身份验证
								    Authorization  : getApp().globalData.Authorization
								},
								data:{
									// 提问者id
									askId : user.id,
									// 是否隐藏
									hidden : true,
									// 拼接的图片路径
									picturePath : data.picturePath, //问题图片
									thumbnailPath : data.thumbnailPath, //问题图片缩略图
									// 问题状态 固定0
									status : 0
								},
							    success: (res) => {
							        uni.showModal({
							        	title: "成功",
							        	content: "问题提交成功",
										success : function(data){
											if(!data.cancel){
												uni.switchTab({
													url: "../../home/home",
													success:function(){
													}
												})
											}
										}
							        })
							        
							    },
								fail: (res) => {
									uni.showModal({
										title: "失败",
										content: "问题提交失败"
									})
									return;
								}
							});
					    },
						fail: (data) => {
							console.log(111)
							console.log(data);
							uni.showModal({
								title: "警告",
								content: "图片上传失败"
							})
							return;
						}
					});
					
					
					
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #f2f2f2;
	}
</style>

<style scoped>
	#content {
		padding: 40rpx 76rpx 0rpx 76rpx;
	}
	#cameraOutter {
		display: flex;
		align-items: center;
		width: 100%;
		min-height: 300rpx;
		background-color: #ffffff;
	}
	#camera {
		position: absolute;
		width: 100rpx;
		height: 86rpx;
		margin-left: 50%;
		left: -50rpx;
		top: 150rpx;
	}
	 #buttons {
		display: flex;
		justify-content: flex-end;
		margin-top: 40rpx;
	}
	#photoAlbum,#reTakePhoto,#submit {
		margin: 0rpx;
		display: flex;
		align-items: center;
		width: 160rpx;
		height: 50rpx;
		color: #FFFFFF;
		background-color: #ffa000;
		font-size: 24rpx; 
	}
	#reTakePhoto,#photoAlbum {
		margin-right: 52rpx;
	}
	#photoAlbum{
	justify-items: center;
	}
	
</style>
