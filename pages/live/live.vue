<template>
	<view>
		<view class="page-body">
			<view id="dplayer"></view>
		</view>
	</view>
</template>

<script>
	//import 'node_modules/dplayer/dist/DPlayer.min.css';
	import flvjs from 'flv.js';
	import DPlayer from 'node_modules/dplayer';
	export default {
		data() {
			return {
				src:''
			}
		},
		onLoad(e) {
			this.src = e.address;
		},
		onReady() {  
			const dp = new DPlayer({
				container: document.getElementById('dplayer'),
				video: {
					url: this.src,
					type: 'customFlv',
					customType: {
						customFlv: function(video, player) {
							const flvPlayer = flvjs.createPlayer({
								type: 'flv',
								url: video.src,
							});
							flvPlayer.attachMediaElement(video);
							flvPlayer.load();
							flvPlayer.play();
						},
					},
				},
			});
		},  
		methods: {

		}
	}
</script>

<style>

</style>
