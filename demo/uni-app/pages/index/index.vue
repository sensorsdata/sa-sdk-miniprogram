<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<button type="default" @click="clickBtn" data-sensors-click>点击事件</button>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	// 在 vue 页面使用 sensors 对象
	var sensors = getApp().sensors;
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
		},
		onShow() {	
		},
		methods: {
			clickBtn: function() {
				sensors.track('pageView123',{
					pagename: 'index'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
