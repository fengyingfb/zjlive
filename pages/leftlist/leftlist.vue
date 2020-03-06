<template>
	<view class="content">
		<view class="uni-list">
			<view class="list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in newsList" :key="index" @tap="openNew(item)"
			 :data-newsid="item.post_id">
				<view class="media-list">
					<view class="media-image-left">
						<text class="media-title2">{{item.title}}</text>
						<view class="image-section-left">
							<image class="image-list2" :src="item.author_avatar"></image>
						</view>
					</view>
					<view class="media-foot">
						<view class="media-info">
							<text class="info-text">{{item.author_name}}</text>
							<text class="info-text">{{item.comments_count}}条评论</text>
							<text class="info-text">{{item.datetime}}</text>
						</view>
						<view class="max-close-view" @click.stop="close">
							<view class="close-view"><text class="close">×</text></view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :loadingType="loadingType" :contentText="contentText"></uni-load-more>
		</view>
	</view>
</template>

<script>
	//1引入组件 uni-load-more.vue
	import uniLoadMore from '@/components/uni-load-more.vue';
	import {
		friendlyDate
	} from '@/common/util.js';
	var _self,
		page = 1,
		timer = null;
	// 定义全局参数,控制数据加载

	export default {
		components: { //2注册组件
			uniLoadMore
		},
		data: {
			newsList: [],
			title: "",
			loadingText: '加载中...',
			loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			}
		},
		onLoad: function(e) {
			_self = this;
			//页面一加载时请求一次数据
			this.getnewsList();
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			this.getnewsList();
		},
		onReachBottom: function() {
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				_self.getmorenews();
			}, 1000);
		},
		methods: {
			getmorenews() {
				if (_self.loadingType !== 0) { //loadingType!=0;直接返回
					return false;
				}
				_self.loadingType = 1;
				uni.showNavigationBarLoading(); //显示加载动画
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/news?pageSize=' + page * 10,
					method: 'GET',
					success: function(res) {
						console.log(JSON.stringify(res));
						const data = res.data.map((news) => {
							return {
								id: news.id,
								author_avatar: news.author_avatar,
								article_type: 1,
								datetime: friendlyDate(new Date(news.published_at.replace(/\-/g, '/')).getTime()),
								title: news.title,
								image_url: news.cover,
								author_name: news.author_name,
								comments_count: news.comments_count,
								post_id: news.post_id
							};
						});
						if (res.data == null) { //没有数据
							_self.loadingType = 2;
							uni.hideNavigationBarLoading(); //关闭加载动画
							return;
						}
						page++; //每触底一次 page +1
						_self.newsList = _self.newsList.concat(data);
						_self.loadingType = 0; //将loadingType归0重置
						uni.hideNavigationBarLoading(); //关闭加载动画
					}
				});
			},
			getnewsList() { //第一次回去数据
				page = 1;
				this.loadingType = 0;
				uni.showNavigationBarLoading();
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/news?pageSize=' + page * 10,
					method: 'GET',
					success: function(res) {
						page++; //得到数据之后page+1
						const data = res.data.map((news) => {
							return {
								id: news.id,
								author_avatar: news.author_avatar,
								article_type: 1,
								datetime: friendlyDate(new Date(news.published_at.replace(/\-/g, '/')).getTime()),
								title: news.title,
								image_url: news.cover,
								author_name: news.author_name,
								comments_count: news.comments_count,
								post_id: news.post_id
							};
						});
						_self.newsList = data;
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					}
				});
			}
		}
	};
</script>

<style>
	view {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.list-cell {
		width: 750upx;
		padding: 0 30upx;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-list {
		flex: 1;
		flex-direction: column;
		border-bottom-width: 1upx;
		border-bottom-style: solid;
		border-bottom-color: #c8c7cc;
		padding: 20upx 0;
	}

	.media-image-left {
		flex-direction: row-reverse;
	}

	.media-title2 {
		flex: 1;
		margin-top: 6upx;
		line-height: 40upx;
		font-size: 30upx;
	}

	.info-text {
		margin-right: 20upx;
		color: #999999;
		font-size: 24upx;
	}

	.image-section {
		margin-top: 20upx;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-left {
		margin-top: 0upx;
		margin-right: 10upx;
		width: 225upx;
		height: 146upx;
	}

	.image-list2 {
		width: 225upx;
		height: 146upx;
	}

	.info-text {
		margin-right: 20upx;
		color: #999999;
		font-size: 24upx;
	}

	.media-foot {
		margin-top: 20upx;
		flex-direction: row;
		justify-content: space-between;
	}

	.media-info {
		flex-direction: row;
	}

	.max-close-view {
		align-items: center;
		justify-content: flex-end;
		flex-direction: row;
		height: 40upx;
		width: 80upx;
	}

	.close-view {
		border-style: solid;
		border-width: 1px;
		border-color: #999999;
		border-radius: 10upx;
		justify-content: center;
		height: 30upx;
		width: 40upx;
		line-height: 30upx;
	}

	.close {
		text-align: center;
		color: #999999;
		font-size: 28upx;
	}
</style>
