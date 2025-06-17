<template>
	<view class="news-detail">
		<view class="news-header">
			<view class="news-title">{{newsDetail.title}}</view>
			<view class="news-info">
				<text class="news-source">{{newsDetail.source}}</text>
				<text class="news-time">{{newsDetail.time}}</text>
			</view>
		</view>
		
		<view class="news-content">
			<image v-if="newsDetail.image" :src="newsDetail.image" mode="widthFix" class="news-image"></image>
			
			<rich-text :nodes="newsDetail.content"></rich-text>
		</view>
		
		<view class="related-news">
			<view class="section-title">相关推荐</view>
			<view 
				class="related-item" 
				v-for="(item, index) in relatedNews" 
				:key="index"
				@click="goDetail(item.id)"
			>
				<text class="related-title">{{item.title}}</text>
				<text class="related-source">{{item.source}}</text>
			</view>
		</view>
		
		<view class="action-bar">
			<view class="action-item" @click="handleLike">
				<text class="iconfont" :class="isLiked ? 'icon-like-fill' : 'icon-like'"></text>
				<text>{{likeCount}}</text>
			</view>
			<view class="action-item" @click="handleComment">
				<text class="iconfont icon-comment"></text>
				<text>{{commentCount}}</text>
			</view>
			<view class="action-item" @click="handleShare">
				<text class="iconfont icon-share"></text>
				<text>分享</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				newsDetail: {
					title: '',
					source: '',
					time: '',
					image: '',
					content: ''
				},
				relatedNews: [],
				isLiked: false,
				likeCount: 0,
				commentCount: 0
			}
		},
		onLoad(options) {
			// 检查登录状态
			const isLogin = uni.getStorageSync('isLogin');
			if (!isLogin) {
				uni.redirectTo({
					url: '/pages/login/login'
				});
				return;
			}
			
			if (options.id) {
				this.id = options.id;
				this.loadNewsDetail();
				this.loadRelatedNews();
			} else {
				uni.showToast({
					title: '参数错误',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		onShareAppMessage() {
			return {
				title: this.newsDetail.title,
				path: `/pages/news/detail?id=${this.id}`
			}
		},
		methods: {
			loadNewsDetail() {
				uni.showLoading({
					title: '加载中...'
				});
				
				// 模拟请求数据
				setTimeout(() => {
					// 模拟新闻详情数据
					this.newsDetail = {
						title: `新闻标题 ${this.id} - 详细内容展示`,
						source: '新闻来源' + Math.floor(Math.random() * 5 + 1),
						time: this.formatDate(new Date() - Math.floor(Math.random() * 10000000)),
						image: 'https://picsum.photos/600/300?random=' + this.id,
						content: this.generateMockContent(this.id)
					};
					
					this.likeCount = Math.floor(Math.random() * 200 + 50);
					this.commentCount = Math.floor(Math.random() * 50 + 10);
					
					uni.hideLoading();
				}, 800);
			},
			loadRelatedNews() {
				// 模拟相关新闻数据
				setTimeout(() => {
					const mockData = [];
					for (let i = 0; i < 5; i++) {
						const relatedId = parseInt(this.id) + i + 1;
						mockData.push({
							id: relatedId,
							title: `相关新闻标题 ${relatedId} - 推荐阅读`,
							source: '新闻来源' + Math.floor(Math.random() * 5 + 1)
						});
					}
					
					this.relatedNews = mockData;
				}, 1000);
			},
			goDetail(id) {
				if (id === this.id) return;
				
				uni.navigateTo({
					url: `/pages/news/detail?id=${id}`
				});
			},
			handleLike() {
				this.isLiked = !this.isLiked;
				this.likeCount = this.isLiked ? this.likeCount + 1 : this.likeCount - 1;
				
				uni.showToast({
					title: this.isLiked ? '点赞成功' : '取消点赞',
					icon: 'none'
				});
			},
			handleComment() {
				uni.showToast({
					title: '评论功能开发中',
					icon: 'none'
				});
			},
			handleShare() {
				uni.showToast({
					title: '分享功能开发中',
					icon: 'none'
				});
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const hour = date.getHours();
				const minute = date.getMinutes();
				
				return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
			},
			generateMockContent(id) {
				// 生成模拟的新闻内容HTML
				return `
					<p style="text-indent: 2em; line-height: 1.8; margin-bottom: 20px;">
						这是第${id}条新闻的详细内容。新闻内容通常包含多个段落，每个段落都有不同的信息点和叙述角度。本段是新闻的开头，通常会概述新闻的主要内容和背景。
					</p>
					<p style="text-indent: 2em; line-height: 1.8; margin-bottom: 20px;">
						新闻的第二段通常会深入探讨新闻事件的细节，包括事件发生的时间、地点、人物以及事件的起因和经过。这些信息有助于读者更全面地了解新闻事件。
					</p>
					<p style="text-indent: 2em; line-height: 1.8; margin-bottom: 20px;">
						在新闻的第三段中，记者可能会引用相关人士的观点和评论，以增加新闻的可信度和多样性。这些观点可能来自事件的参与者、目击者、专家或官方发言人。
					</p>
					<p style="text-indent: 2em; line-height: 1.8; margin-bottom: 20px;">
						新闻的第四段通常会分析事件的影响和意义，探讨事件可能带来的后果和变化。这部分内容有助于读者理解新闻事件的重要性和价值。
					</p>
					<p style="text-indent: 2em; line-height: 1.8; margin-bottom: 20px;">
						在新闻的结尾，记者可能会总结新闻的主要内容，或者展望未来的发展趋势。有时也会提供一些背景信息或相关链接，方便读者进一步了解相关内容。
					</p>
				`;
			}
		}
	}
</script>

<style lang="scss">
	.news-detail {
		padding-bottom: 100rpx;
		
		.news-header {
			padding: 30rpx;
			background-color: #fff;
			
			.news-title {
				font-size: 40rpx;
				font-weight: bold;
				color: #333;
				line-height: 1.4;
				margin-bottom: 20rpx;
			}
			
			.news-info {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #999;
				
				.news-source {
					margin-right: 20rpx;
				}
			}
		}
		
		.news-content {
			padding: 30rpx;
			background-color: #fff;
			margin-top: 20rpx;
			
			.news-image {
				width: 100%;
				margin-bottom: 30rpx;
				border-radius: 8rpx;
			}
		}
		
		.related-news {
			margin-top: 20rpx;
			padding: 30rpx;
			background-color: #fff;
			
			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				color: #333;
			}
			
			.related-item {
				padding: 20rpx 0;
				border-bottom: 1rpx solid #eee;
				
				&:last-child {
					border-bottom: none;
				}
				
				.related-title {
					font-size: 28rpx;
					color: #333;
					line-height: 1.4;
					margin-bottom: 10rpx;
					display: block;
				}
				
				.related-source {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.action-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-around;
			border-top: 1rpx solid #eee;
			
			.action-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				color: #666;
				
				.iconfont {
					font-size: 40rpx;
					margin-bottom: 6rpx;
					
					&.icon-like-fill {
						color: #ff5a5f;
					}
				}
			}
		}
	}
</style> 