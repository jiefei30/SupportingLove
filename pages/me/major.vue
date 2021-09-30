<template>
	<view class="me-body">
		<view class="cu-form-group margin-top me-padding">
			<view class="title">选择你的解答科目：</view>
		</view>
		
		<!-- <view class="me-content">
			<view class="me-content-item me-no-border">
				<text>选择你的解答科目：</text>
			</view>
		</view> -->
		<!-- 科目复选框 -->
		<view class="major-content">
			<checkbox-group @change="checkboxChange">
				<label class="major-item" v-for="item in items" :key="item.value">
					<view>{{item.name}}</view>
					<view>
						<checkbox color="#FFC107" :value="item.value" :checked="item.checked" />
					</view>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 items: [{
					value: '语文',
					name: '语文',
					checked:false
				},
				{
					value: '数学',
					name: '数学',
					checked:false
				},
				{
					value: '英语',
					name: '英语',
					checked:false
				}]
			}
		},
		onLoad(){
			var answerSubject = getApp().globalData.answerSubject.split(",");
			for(let i in answerSubject){
				for(let j in this.items){
					if(answerSubject[i] == this.items[j].name) this.items[j].checked = true;
				}
			}
		},
		methods: {
			//科目发生变化
			checkboxChange: function (e) {
				getApp().globalData.answerSubject = e.detail.value.join(',');
			}		        
		}
	}
</script>

<style scoped>
.major-content{
	padding: 0 48rpx;
	background-color: #fff;
}
.major-item{
	display: block;
	float: left;
	margin: 48rpx;
}
</style>
