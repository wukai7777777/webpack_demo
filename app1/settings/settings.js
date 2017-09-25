import Vue from 'vue'
import 'zepto'
import 'clientApi/kerkee.js'
import core from 'clientApi/KCcore'
import store from './store'

import KCsettingsApi from 'clientApi/KCsettingsApi'
import * as settings_mt from 'components/settings/settings-mutation-types'

import App from './App'

new core().start(() => {
	KCsettingsApi.getIMNotifyStatus(function(data){
	    var switchData = data.status == 0 ? false : true;
	    store.commit(settings_mt.SET_SWITCH_DATA, switchData)
	    new Vue({
			el: '#mountRoot',
			store,
			components: { App }
		})
	});
})