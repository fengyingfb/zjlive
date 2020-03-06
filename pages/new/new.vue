<template>
	<view class="center">
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in news" :key="index" @tap="openNew" :data-newsid="item.post_id">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="item.author_avatar"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{item.title}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{item.created_at}}</view>
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
				news: []
			};
		},
		onLoad: function() {
			uni.request({
				url: 'https://unidemo.dcloud.net.cn/api/news',
				method: 'GET',
				data: {},
				success: res => {
					console.log(res);
					console.log(JSON.stringify(res));
					this.news = res.data;
					
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			openNew(e) {
				console.log(JSON.stringify(e));
				var newsid = e.currentTarget.dataset.newsid;
				uni.navigateTo({
					// url: '../new/new-info',
					url: '../info/info?newsid='+newsid,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},

	}
</script>

<style>

</style>
