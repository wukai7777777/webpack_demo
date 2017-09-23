import Vue from 'vue'
import 'zepto'
import 'clientApi/kerkee.js'
import core from 'clientApi/KCcore'
import store from './store'

import App from './App'

new core().start(() => {

	new Vue({
		el: '#mountRoot',
		store,
		components: { App }
	})

})