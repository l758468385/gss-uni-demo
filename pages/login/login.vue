<template>
	<view class="login-container">
		<view class="logo">
			<image src="/static/logo.png" mode="aspectFit"></image>
		</view>
		
		<view class="form-item">
			<text class="label">用户名</text>
			<input type="text" v-model="username" placeholder="请输入用户名" />
		</view>
		
		<view class="form-item">
			<text class="label">密码</text>
			<input type="password" v-model="password" placeholder="请输入密码" />
		</view>
		
		<button class="login-btn" type="primary" @click="handleLogin">登录</button>
		
		<view class="tips">
			<text @click="forgetPassword">忘记密码?</text>
			<text @click="toRegister">注册账号</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			handleLogin() {
				if (!this.username || !this.password) {
					uni.showToast({
						title: '用户名和密码不能为空',
						icon: 'none'
					});
					return;
				}
				
				// 模拟登录
				uni.showLoading({
					title: '登录中...'
				});
				
				setTimeout(() => {
					uni.hideLoading();
					
					// 模拟登录成功
					uni.setStorageSync('isLogin', true);
					uni.setStorageSync('userInfo', {
						username: this.username,
						nickname: '用户' + Math.floor(Math.random() * 1000)
					});
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});
					this.$analytics.setUserId(this.username);
					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 1500);
				}, 1000);
			},
			forgetPassword() {
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				});
			},
			toRegister() {
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		padding: 50rpx;
		
		.logo {
			text-align: center;
			margin-bottom: 80rpx;
			
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
		
		.form-item {
			margin-bottom: 40rpx;
			
			.label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				display: block;
			}
			
			input {
				height: 90rpx;
				background-color: #f8f8f8;
				border-radius: 45rpx;
				font-size: 28rpx;
				padding: 0 30rpx;
			}
		}
		
		.login-btn {
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 45rpx;
			font-size: 32rpx;
			margin-top: 60rpx;
		}
		
		.tips {
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
			font-size: 26rpx;
			color: #666;
			
			text {
				padding: 10rpx;
			}
		}
	}
</style> 