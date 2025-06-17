<template>
	<view class="news-list">
		<view class="search-box">
			<view class="search-input">
				<text class="iconfont icon-search"></text>
				<input type="text" v-model="keyword" placeholder="搜索新闻" confirm-type="search" @confirm="searchNews" />
			</view>
		</view>
		
		<view class="category-tabs">
			<scroll-view scroll-x class="tabs-scroll" show-scrollbar="false">
				<view 
					class="tab-item" 
					:class="{ active: currentCategory === item.id }" 
					v-for="item in categories" 
					:key="item.id"
					@click="changeCategory(item.id)"
				>
					{{item.name}}
				</view>
			</scroll-view>
		</view>
		
		<view class="news-container">
			<view v-if="newsList.length === 0" class="empty-tip">
				<text>暂无相关新闻</text>
			</view>
			
			<view v-else>
				<view 
					class="news-item"
					v-for="(item, index) in newsList" 
					:key="index"
					@click="goDetail(item.id)"
				>
					<view class="news-content">
						<view class="news-title">{{item.title}}</view>
						<view class="news-desc">{{item.desc}}</view>
						<view class="news-info">
							<text class="news-source">{{item.source}}</text>
							<text class="news-time">{{item.time}}</text>
						</view>
					</view>
					<image class="news-image" :src="item.image" mode="aspectFill"></image>
				</view>
				
				<view class="loading-more" v-if="hasMore">
					<text>加载中...</text>
				</view>
				<view class="no-more" v-else>
					<text>没有更多了</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				currentCategory: 0,
				categories: [
					{ id: 0, name: '推荐' },
					{ id: 1, name: '科技' },
					{ id: 2, name: '财经' },
					{ id: 3, name: '体育' },
					{ id: 4, name: '娱乐' },
					{ id: 5, name: '教育' },
					{ id: 6, name: '健康' }
				],
				newsList: [],
				page: 1,
				pageSize: 10,
				hasMore: true,
				isLoading: false
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
			
			this.loadNewsList();
		},
		onPullDownRefresh() {
			this.page = 1;
			this.newsList = [];
			this.hasMore = true;
			this.loadNewsList(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			if (this.hasMore && !this.isLoading) {
				this.page++;
				this.loadNewsList();
			}
		},
		methods: {
			loadNewsList(callback) {
				if (this.isLoading) return;
				
				this.isLoading = true;
				
				// 模拟请求数据
				setTimeout(() => {
					// 模拟新闻数据
					const mockData = [];
					for (let i = 0; i < this.pageSize; i++) {
						const id = (this.page - 1) * this.pageSize + i + 1;
						if (id > 30) {
							this.hasMore = false;
							break;
						}
						
						mockData.push({
							id: id,
							title: `新闻标题 ${id} - ${this.categories.find(c => c.id === this.currentCategory).name}类别`,
							desc: `这是第${id}条新闻的简短描述，包含了新闻的主要内容和要点...`,
							image: 'https://picsum.photos/200/200?random=' + id,
							source: '新闻来源' + Math.floor(Math.random() * 5 + 1),
							time: this.formatDate(new Date() - Math.floor(Math.random() * 10000000))
						});
					}
					
					this.newsList = this.page === 1 ? mockData : [...this.newsList, ...mockData];
					this.isLoading = false;
					
					if (callback) callback();
				}, 1000);
			},
			changeCategory(categoryId) {
				if (this.currentCategory === categoryId) return;
				
				this.currentCategory = categoryId;
				this.page = 1;
				this.newsList = [];
				this.hasMore = true;
				this.loadNewsList();
			},
			searchNews() {
				if (!this.keyword.trim()) {
					uni.showToast({
						title: '请输入搜索关键词',
						icon: 'none'
					});
					return;
				}
				
				this.page = 1;
				this.newsList = [];
				this.hasMore = true;
				this.loadNewsList();
			},
			goDetail(id) {
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
	.news-list {
		background-color: #f5f5f5;
		min-height: 100vh;
		
		.search-box {
			padding: 20rpx;
			background-color: #fff;
			
			.search-input {
				display: flex;
				align-items: center;
				background-color: #f2f2f2;
				border-radius: 30rpx;
				padding: 10rpx 20rpx;
				
				.icon-search {
					margin-right: 10rpx;
					color: #999;
				}
				
				input {
					flex: 1;
					height: 60rpx;
					font-size: 28rpx;
				}
			}
		}
		
		.category-tabs {
			background-color: #fff;
			border-bottom: 1rpx solid #eee;
			
			.tabs-scroll {
				white-space: nowrap;
				padding: 0 20rpx;
			}
			
			.tab-item {
				display: inline-block;
				padding: 20rpx 30rpx;
				font-size: 28rpx;
				color: #666;
				position: relative;
				
				&.active {
					color: #007aff;
					font-weight: bold;
					
					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 40rpx;
						height: 4rpx;
						background-color: #007aff;
					}
				}
			}
		}
		
		.news-container {
			padding: 20rpx;
			
			.empty-tip {
				text-align: center;
				padding: 100rpx 0;
				color: #999;
			}
			
			.news-item {
				display: flex;
				background-color: #fff;
				padding: 20rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				
				.news-content {
					flex: 1;
					padding-right: 20rpx;
					
					.news-title {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 10rpx;
						line-height: 1.4;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					
					.news-desc {
						font-size: 26rpx;
						color: #666;
						line-height: 1.4;
						margin-bottom: 10rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					
					.news-info {
						font-size: 24rpx;
						color: #999;
						display: flex;
						justify-content: space-between;
					}
				}
				
				.news-image {
					width: 200rpx;
					height: 150rpx;
					border-radius: 6rpx;
				}
			}
			
			.loading-more, .no-more {
				text-align: center;
				padding: 20rpx 0;
				color: #999;
				font-size: 24rpx;
			}
		}
	}
</style> 