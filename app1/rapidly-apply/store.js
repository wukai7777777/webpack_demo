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

import comLoginInterface from 'components/com-login/com-login-interface'
import comNoidencodeInterface from 'components/com-noidencode/com-noidencode-interface'
import comNecessaryInterface from 'components/com-necessary/com-necessary-interface'
import comLimitedconditionInterface from 'components/com-limitedcondition/com-limitedcondition-interface'

Vue.use(Vuex)

/**
 * [modules 接口写成模块]
 * @type {Object}
 */
export default new Vuex.Store({
	modules: {
        comLoginInterface,
        comNoidencodeInterface,
        comNecessaryInterface,
        comLimitedconditionInterface
	}
})
