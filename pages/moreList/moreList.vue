<template>
	<view class="content">
		<page-head :title="title"></page-head>
		<view class="uni-list">
			<view class="list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index" @tap="openNew(item)">
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
			                <!-- <text class="info-text">{{item.datetime}}</text> -->
			            </view>
			            <view class="max-close-view" @click.stop="close">
			                <view class="close-view"><text class="close">×</text></view>
			            </view>
			        </view>
			    </view>
			</view>
		</view>
	</view>
</template>
<script>
	import uniLoadMore from '../../components/uni-load-more.vue'
	export default {
		data() {
			return {
				title: 'uni-load-more',
				list: [],
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onLoad() {
			//let list = [];
			uni.request({
				url: 'https://unidemo.dcloud.net.cn/api/news',
				method: 'GET',
				data: {},
				success: res => {
					console.log("新闻列表:"+JSON.stringify(res.data));
					let list = res.data;
					this.list = list;
				},
				fail: () => {},
				complete: () => {}
			});
		},
		
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			let list = [],
			//let list = res.data;
				maxItem = this.list[this.list.length - 1],
				length = maxItem + 6;
			for (let i = maxItem + 1; i < length; i++) {
				list.push(i);
			}
			setTimeout(() => {
				if (length > 26) {
					this.loadingType = 2;
					return;
				}
				this.list = this.list.concat(list);
				this.loadingType = 0;
			}, 800);
		},
		components: {
			uniLoadMore
		},
		methods:{
			
		}
	}
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
