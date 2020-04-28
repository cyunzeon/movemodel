// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index';
import axios from 'axios'
import Vuex from 'vuex'
import 'lib-flexible/flexible.js'
import './assets/css/reset.css'



//全局引入mintui的组件
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(MintUI);

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

Vue.use(Vuex);
Vue.prototype.$http=axios;

var instance = axios.create({
  baseURL:'',
  timeout:5000,
  headers:{"Content-Type":"multipart/form-data"
}
});
 
Vue.prototype.axios = axios;
Vue.prototype.instance=instance;
//单个引入mintui的组件
// import {Button,Swipe} from 'mint-ui';
// 注册成全局标签
// Vue.component(Button.name,"Button");
// Vue.component(Swipe.name,"Swipe");

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
