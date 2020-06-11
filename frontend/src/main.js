import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueWorker from 'vue-worker';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.use(VueWorker);

import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.devtools = true;

import Wails from '@wailsapp/runtime';

Wails.Init(() => {
	new Vue({
		vuetify: new Vuetify({
			icons: {
				iconfont: 'mdi'
			},
			theme: {
				dark: true
			}
		}),
		render: h => h(App)
	}).$mount('#app');
});
