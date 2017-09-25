/**
 *  引入框架
 */
import Vue from 'vue'
import 'zepto'
import 'clientApi/kerkee.js'
import core from 'clientApi/KCcore'
import store from './store'

/**
 *  引入根组件
 */
import App from './App'

/**
 *  start
 */
new core().start(() => {
	new Vue({
		el: '#mountRoot',
		store,
		components: { App }
	})
})