
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import axios from 'axios'
import echarts from 'echarts'


Vue.use(elementUI)
axios.defaults.baseURL='http://localhost:8081/ssm-union'
Vue.prototype.$http =axios
Vue.prototype.$qs = qs
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false;

// window.onload=function(){
//   console.clear()
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
