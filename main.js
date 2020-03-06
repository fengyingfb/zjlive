import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.$serverUrl = 'https://unidemo.dcloud.net.cn';
Vue.prototype.$liveUrl = 'http://api.zbjk.xyz:81/luo';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
