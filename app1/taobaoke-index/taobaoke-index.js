/**
 *  引入框架
 */
import Vue from 'vue'
import 'zepto'
import 'clientApi/kerkee.js'
import core from 'clientApi/KCcore'
import store from './store'
import fastclick from 'tool/lib/fastclick'

/**
 *  引入根组件
 */
import App from './App'

/**
 *  start
 */
fastclick.attach(document.body);
new core().start(() => {
	new Vue({
		el: '#mountRoot',
		store,
		components: { App }
	})
})