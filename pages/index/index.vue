<template>
	<view class="home">
		<view class="user-info">
			<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
			<view class="user-detail">
				<text class="nickname">{{userInfo.nickname || '游客'}}</text>
				<text class="welcome">欢迎回来</text>
			</view>
		</view>
		
		<view class="banner-swiper">
			<swiper class="swiper" indicator-dots autoplay circular :interval="3000" :duration="500">
				<swiper-item v-for="(item, index) in banners" :key="index">
					<image :src="item.image" mode="aspectFill" class="banner-image" @click="handleBannerClick(item)"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="nav-grid">
			<view class="grid-item" v-for="(item, index) in navItems" :key="index" @click="navigateTo(item.url)">
				<image :src="item.icon" mode="aspectFit" class="grid-icon"></image>
				<text class="grid-text">{{item.name}}</text>
			</view>
		</view>
		
		<view class="section">
			<view class="section-header">
				<text class="section-title">热门资讯</text>
				<text class="more" @click="navigateTo('/pages/news/list')">更多</text>
			</view>
			
			<view class="news-list">
				<view class="news-item" v-for="(item, index) in hotNews" :key="index" @click="goNewsDetail(item.id)">
					<image :src="item.image" mode="aspectFill" class="news-image"></image>
					<view class="news-content">
						<text class="news-title">{{item.title}}</text>
						<view class="news-info">
							<text class="news-source">{{item.source}}</text>
							<text class="news-time">{{item.time}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					nickname: '',
					avatar: ''
				},
				banners: [
					{
						id: 1,
						image: 'https://picsum.photos/750/300?random=1',
						url: '/pages/news/detail?id=1'
					},
					{
						id: 2,
						image: 'https://picsum.photos/750/300?random=2',
						url: '/pages/news/detail?id=2'
					},
					{
						id: 3,
						image: 'https://picsum.photos/750/300?random=3',
						url: '/pages/news/detail?id=3'
					}
				],
				navItems: [
					{
						name: '最新资讯',
						icon: '/static/icon-news.png',
						url: '/pages/news/list'
					},
					{
						name: '热门话题',
						icon: '/static/icon-hot.png',
						url: '/pages/news/list?category=1'
					},
					{
						name: '科技动态',
						icon: '/static/icon-tech.png',
						url: '/pages/news/list?category=2'
					},
					{
						name: '财经资讯',
						icon: '/static/icon-finance.png',
						url: '/pages/news/list?category=3'
					}
				],
				hotNews: []
			}
		},
		onLoad() {
			// 检查登录状态
			const isLogin = uni.getStorageSync('isLogin');
			if (!isLogin) {
				uni.redirectTo({
					url: '/pages/login/login'
				});
				return;
			}
			
			// 获取用户信息
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.userInfo = userInfo;
			}
			
			// 加载热门新闻
			this.loadHotNews();
		},
		methods: {
			loadHotNews() {
				// 模拟请求数据
				setTimeout(() => {
					// 模拟热门新闻数据
					const mockData = [];
					for (let i = 0; i < 3; i++) {
						mockData.push({
							id: i + 1,
							title: `热门新闻标题 ${i + 1} - 精选推荐内容`,
							image: 'https://picsum.photos/200/200?random=' + (i + 10),
							source: '新闻来源' + Math.floor(Math.random() * 5 + 1),
							time: this.formatDate(new Date() - Math.floor(Math.random() * 10000000))
						});
					}
					
					this.hotNews = mockData;
				}, 500);
			},
			handleBannerClick(item) {
				uni.navigateTo({
					url: item.url
				});
			},
			navigateTo(url) {
				if (url.indexOf('/pages/news/list') === 0) {
					uni.switchTab({
						url: '/pages/news/list'
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			goNewsDetail(id) {
				uni.navigateTo({
					url: `/pages/news/detail?id=${id}`
				});
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const now = new Date();
				const diff = now - date;
				
				// 小于1小时，显示xx分钟前
				if (diff < 3600000) {
					return Math.floor(diff / 60000) + '分钟前';
				}
				// 小于24小时，显示xx小时前
				else if (diff < 86400000) {
					return Math.floor(diff / 3600000) + '小时前';
				}
				// 小于30天，显示xx天前
				else if (diff < 2592000000) {
					return Math.floor(diff / 86400000) + '天前';
				}
				// 否则显示具体日期
				else {
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();
					return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
				}
			}
		}
	}
</script>

<style lang="scss">
	.home {
		background-color: #f5f5f5;
		min-height: 100vh;
		
		.user-info {
			display: flex;
			align-items: center;
			padding: 30rpx;
			background-color: #fff;
			
			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			
			.user-detail {
				flex: 1;
				
				.nickname {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 6rpx;
					display: block;
				}
				
				.welcome {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.banner-swiper {
			margin: 20rpx;
			border-radius: 12rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			
			.swiper {
				height: 300rpx;
			}
			
			.banner-image {
				width: 100%;
				height: 100%;
			}
		}
		
		.nav-grid {
			display: flex;
			flex-wrap: wrap;
			background-color: #fff;
			padding: 20rpx 0;
			margin-bottom: 20rpx;
			
			.grid-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 20rpx 0;
				
				.grid-icon {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 10rpx;
				}
				
				.grid-text {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
		
		.section {
			background-color: #fff;
			padding: 20rpx;
			margin-bottom: 20rpx;
			
			.section-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				
				.section-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					position: relative;
					padding-left: 20rpx;
					
					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 8rpx;
						height: 30rpx;
						background-color: #007aff;
						border-radius: 4rpx;
					}
				}
				
				.more {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.news-list {
				.news-item {
					display: flex;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #eee;
					
					&:last-child {
						border-bottom: none;
					}
					
					.news-image {
						width: 200rpx;
						height: 140rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
					}
					
					.news-content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						.news-title {
							font-size: 28rpx;
							color: #333;
							line-height: 1.4;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.news-info {
							display: flex;
							justify-content: space-between;
							font-size: 24rpx;
							color: #999;
						}
					}
				}
			}
		}
	}
</style>
