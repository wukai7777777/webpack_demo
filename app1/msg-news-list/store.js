/**
 *  引入框架
 */
import Vue from 'vue'
import 'es6-promise/auto'
import Vuex from 'vuex'

/**
 *  引入组件的接口文件(Interface)
 *  example : import SomeInterface from 'components/Some/SomeInterface'
 */

import comBomLoading from 'components/com-bom-loading/com-bom-loading-interface'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

/**
 * [modules 接口写成模块]
 * @type {Object}
 */
export default new Vuex.Store({
	modules: {
		comBomLoading
	}
})
