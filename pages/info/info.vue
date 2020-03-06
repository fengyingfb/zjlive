<template>
	<view class="content">
		<page-head :title="title"></page-head>
		<view class="title">{{title}}</view>
		<view class="art-content">
			<rich-text class="richText" :nodes="strings"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				// titles:'',
				strings:''
			};
		},
		
		onLoad:function(e){
			//console.log(JSON.stringify(e));
			//this.titles= e.title
			uni.setNavigationBarTitle({
				title:"res.data.title"
			});
			uni.request({
				url: 'https://unidemo.dcloud.net.cn/api/news/36kr/'+e.newsid,
				method: 'GET',
				data: {},
				success: res => {
					this.title =res.data.title;
					uni.setNavigationBarTitle({
						title:res.data.title
					});
					this.strings =res.data.content;
				},
				fail: () => {},
				complete: () => {}
			});		
		}
	}
</script>

<style>
.content{
	padding: 10upx;width: 96%;flex-wrap: wrap;
}
.title{
	line-height: 2em; font-weight: 700;font-size: 38upx;
}
.art-content{
	line-height: 2em;
}
</style>
