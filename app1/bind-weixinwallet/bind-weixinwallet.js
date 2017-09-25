import Vue from 'vue'
import 'zepto'
import 'clientApi/kerkee.js'
import core from 'clientApi/KCcore'
import store from './store'

import fastclick from 'tool/lib/fastclick'

import App from './App'

fastclick.attach(document.body);
new core().start(() => {

	new Vue({
		el: '#mountRoot',
		store,
		components: { App }
	})

})