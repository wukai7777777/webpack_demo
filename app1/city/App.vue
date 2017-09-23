<template>
<div class="pagewrap">
    <body>
        <div class="pagewrap">
            <!-- wrap start -->
            <article class="mod-margin-box">
                <section class="city">
                    <div class="location js-location" v-bind:class="{ active: isLocationActive }">
                        <span>当前定位：</span>
                        <b class="js-city-position" @click="clickLocateCity(isLocClickable)" >{{locateCity}}</b>
                        <i class="icon-refresh" v-bind:class="{ active: isRefreshActive }" @click="refresh($event)">刷新</i>
                    </div>
                    <!-- <div class="location active">
                        <span>当前定位：</span><b>北京</b><i class="icon-refresh">刷新</i>
                    </div> -->
                    <div class="column" v-show="isTopCityShowed">
                        <div class="column-head">
                            <h2 class="column-title">热门城市</h2>
                        </div>
                        <div class="column-body js-top-citys-wrap">
                            <ul class="category js-category">
                                <li v-for="(value,index) in cities"><a class="js-top-citys-wrap js-category-a js-change-city" @click="sendDataChangeCity(value.domain, value.name, value.id, 1)">{{value.name}}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="column" v-show="isOtherCityShowed">
                        <div class="column-head">
                            <h2 class="column-title">其他城市<span>(可在省份里选择具体城市)</span></h2>
                        </div>
                        <div class="column-body js-other-citys-wrap">
                            <template  v-for="(value , provincesIndex) in provinces">
                                <ul class="category">
                                    <template v-for="(item,index) in value">
                                        <li v-if="!!item.citys" @click="toggleCity(provincesIndex, index, item)" v-bind:class="{active: currentProvince==provincesIndex && currentItem.index==index}">
                                            <b class="city-true" v-bind:class="{active: currentProvince==provincesIndex && currentItem.index==index}" >{{item.name}}</b>
                                        </li>
                                        <li v-else>
                                            <a class="js-change-city J_other" @click="sendDataChangeCity(item.domain, item.name, item.id, 2)">
                                                <b v-bind:data-citys="false" >{{item.name}}</b>
                                            </a>
                                        </li>
                                    </template>
                                </ul>
                                <ul class="category-child active" v-if="currentProvince==provincesIndex">
                                    <li v-for="value in childCities" class="active">
                                        <a class="js-change-city J_other" @click="sendDataChangeCity(value.domain, value.name, value.id, 2)">{{value.name}}</a>
                                    </li>
                                </ul>
                            </template>
                        </div>
                    </div>
                </section>
            </article>
        </div>
        <!-- popup start -->
        <div class="pop">
            <h2 class="pop-hint-txt">当前定位城市是<b class="js-city-position">{{locateCity}}</b><br>与所选城市不一样，是否更改？</h2>
            <ul class="pop-btnbox mod-flex">
                <li class="js-touch-state mod-cont js-cancel">取消</li>
                <li class="js-touch-state mod-cont js-change"><a class="js-change-city" href="javascript:;">更改</a></li>
            </ul>
        </div>
        <div class="mask"></div>
        <!-- popup end -->

        <div class="tip" style="display: none;"></div>
    </body>
</div>
        
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCwidget from 'clientApi/KCwidget'
    import Util from 'tool/widget/Util'
    import KCcityApi from 'clientApi/KCcityApi'
    import KClocationApi from 'clientApi/KClocationApi'
    import KCcache from 'clientApi/KCcache'
    import KCindexPage from 'clientApi/KCindexPage'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data: function(){
            return{
                // 判断是否有网络
                netWork: true,
                // 主机域名
                host: '',
                // 客户端参数
                param: {},
                // {"s_city":"喀什","city":"北京市","citydomain":"kashi","s_citydomain":"kashi"}
                otherCityData: null,
                // 缓存 其他城市 数据
                singleLocateCityClick: null,
                locateCity: '正在定位中',
                isLocationActive: false,
                isRefreshActive: true,
                isLocClickable: false,
                cityJsonParam: {},
                cities: {},
                provinces: {},
                childCitys: {},
                childCities: {},
                currentProvince: -1,
                currentItem: {},
                isTopCityShowed: false,
                isOtherCityShowed: false
            }
        },
        vuex: {
            getters: {

            },
            actions: {

            }
        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun (){
                var self = this;

                // 从客户端获取参数
                KCcityApi.getOptions(function (data) {
                    self.param = data;
                    if (!self.param.cityid) {
                        //定位失败
                        self.locateCity = '定位失败';
                        self.isLocationActive = true;
                        self.isRefreshActive = false;
                        KCwidget.toast('定位失败，请手动切换城市');
                        self.isLocClickable = false;
                    } else {
                        self.compCity(self.param.citydomain, self.param.s_citydomain, self.param.city, self.param.cityid);
                    }
                });

                KCcache.getCache('topCityData', function(data){
                    if(!data){
                        // 没有缓存
                        // 加载热门城市
                        self.loadTopCityData();
                    }else{
                        // 加载热门城市
                        self.loadTopCityData(data);
                    }
                });

                KCcache.getCache('otherCityData', function(data){
                    if(!data){
                        // 没有缓存
                        // 加载其他城市
                        self.loadOtherCityData();
                    }else{
                        // 加载其他城市
                        self.loadOtherCityData(data);
                    }
                });
            },
            // 点击定位城市
            refresh(event){ //点击刷新
                var self = this;
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=fresh');
                self.isLocationActive = false;
                self.isRefreshActive = true;
                self.locateCity = '正在定位中';
                self.getPosCity();

                event.stopPropagation();
                return false;
            },

            /*
             * 定位城市
             * @method getPosCity
             * @public
             * @return {Null}
             * @example
             *      this.getPosCity();
             * @since 1.0.0
             */
            getPosCity() {
                var self = this;

                KClocationApi.getCity(function(data){
                    if(!data){
                        // 定位失败
                        self.locateCity = '定位失败';
                        self.isLocationActive = true;
                        self.isRefreshActive = false;
                        KCwidget.toast('定位失败，请手动切换城市');
                        self.isLocClickable = false;
                    }else{
                        self.compCity(data.citydomain, self.param.s_citydomain, data.city, data.cityid);
                    }

                });

            },
            /*
             * 对比用户选择的城市与当前定位城市是否一致
             * @method showAlter
             * @public
             * @param {String} ditydomain 当前定位的城市domain
             * @param {String} s_ditydomain 用户选择的城市domain
             * @param {String} city 定位城市
             * @param {String} cityid 定位城市的id
             * @return {Null}
             * @example
             *      this.showAlter();
             * @since 1.0.0
             */
            compCity(citydomain, s_citydomain, city, cityid){
                // alert(citydomain + '-' + s_citydomain)
                var self = this;
                self.isLocationActive = true;
                self.isRefreshActive = false;
                self.locateCity = city;

                self.cityJsonParam.citydomain = citydomain;
                self.cityJsonParam.cityname = city;
                self.cityJsonParam.cityid = cityid;

                self.isLocClickable = true;
            },

            /*
             * 点击定位城市
             * @method clickLocateCity
             * @public
             * @return {Null}
             * @example
             *      this.clickLocateCity(isClickable);
             * @since 1.0.0
             */
            clickLocateCity(isLocClickable){
                let self = this;
                if (isLocClickable) {
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=position');
                    KCcityApi.changeCity(self.cityJsonParam);
                }
            },
            /*
             * 加载开通城市数据(热门城市)
             * @method loadTopCityData
             * @public
             * @param {Array} cacheData 数据，如果cacheData不是undefined，证明有缓存数据
             * @return {Null}
             * @example
             *      this.loadTopCityData(cacheData);
             * @since 1.0.0
             */
            loadTopCityData(cacheData) {
                var self = this;

                if(cacheData){
                    self.cities = cacheData;
                    self.isTopCityShowed = true;
                }
                Util.ajax({
                    type : 'GET',
                    url : '/citys',
                    timeout : 10000,
                    data:{
                        platform:Util.OS,
                        token:''
                    },
                    ctrlStatus: {
                        loading: 1,
                        cache: cacheData,
                        errNum: 0,
                        netNum: 0,
                    },
                    success : function(data){
                        if(!!data && Array.isArray(data)){

                            if(!cacheData){
                                self.cities = data;
                                self.isTopCityShowed = true;
                            }
                            // 更新缓存数据
                            KCcache.setCache('topCityData', data, 3 * 24 * 60 * 60);

                        }else{
                            if(!cacheData){
                                KCwidget.toast('网络异常');
                            }
                        }

                    },
                    error : function(xhr, status){
                    },
                    noNetwork: function(){
                    }
                });
            },
            /*
             * 向客户端发送切换城市的数据
             * @method sendDataChangeCity
             * @public
             * @return {Null}
             * @example
             *      this.toggleCity();
             * @since 1.0.0
             */
            sendDataChangeCity(domain, cityname, cityid, fromId) {
                if(fromId == 2){
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=other_city');
                }else{
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=hot_city');
                }
                var jsonParam = {};
                jsonParam.citydomain = domain;
                jsonParam.cityname = cityname;
                jsonParam.cityid = cityid;
                // console.log(JSON.stringify(jsonParam));
                KCcityApi.changeCity(jsonParam);
            },
            /*
             * 加载其他城市数据
             * @method loadOtherCityData
             * @public
             * @param {Array} cacheData 数据，如果cacheData不是undefined，证明有缓存数据
             * @return {Null}
             * @example
             *      this.loadOtherCityData(cacheData);
             * @since 1.0.0
             */
            loadOtherCityData(cacheData){
                var self = this;

                if (cacheData) {
                    self.renderOtherCity(cacheData);
                    self.isOtherCityShowed = true;
                }

                Util.ajax({
                    type: 'GET',
                    url: '/provinces',
                    data: {
                        platform: Util.OS,
                        token: ''
                    },
                    ctrlStatus: {
                        loading: 0,
                        cache: cacheData,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {

                        if (!!data && Array.isArray(data)) {

                            if (!cacheData) {
                                self.renderOtherCity(data);
                                self.isOtherCityShowed = true;
                            }
                            // 更新缓存数据
                            KCcache.setCache('otherCityData', data, 3 * 24 * 60 * 60);
                            // cache.setCache('otherCityData', data, 3 * 60);

                        } else {
                            if (!cacheData) {
                                KCwidget.toast('网络异常');
                            }
                        }

                    },
                    error: function (xhr, status) {
                    },
                    noNetwork: function () {
                    }
                });
            },
            /*
             * 渲染其他城市数据
             * @method renderOtherCity
             * @public
             * @param {Array} data
             * @return {Null}
             * @example
             *      this.renderOtherCity(data);
             * @since 1.0.0
             */
            renderOtherCity (data){
                // 数据处理成适合模板的结构
                var self = this;
                var dataLength = data.length;
                var tempArray = [];
                for(var i = 0; i < Math.ceil(dataLength / 4); i++){
                    tempArray.push(data.slice(i * 4, (i * 4) + 4));
                }

                self.otherCityData = data;

                self.provinces = tempArray;
            },
            /*
             * 点击带有子城市的省份展开/收起的方法
             * @method toggleCity
             * @public
             * @return {Null}
             * @example
             *      this.toggleCity();
             * @since 1.0.0
             */
            toggleCity(provinceIndex, itemIndex, item) {
                var self = this;
                if(!!self.currentItem && self.currentItem == item)
                {
                    self.currentProvince = -1;
                    self.currentItem.isProvinceActive = false;
                    self.currentItem.isToggleCity = false;
                    self.currentItem = null;
                    self.currentItem.index = -1;
                }
                else {
                    self.currentItem = item;
                    self.currentItem.isProvinceActive = true;
                    self.currentItem.isToggleCity = true;
                    self.currentProvince = provinceIndex;
                    self.currentItem.index = itemIndex;
                    var curName = item.name;
                    var len = self.otherCityData.length;
                    for (let i = 0; i < len; i++) {
                        let city = self.otherCityData[i];
                        if (city.name == curName) {
                            self.childCities = city.citys;
//                            console.log(self.childCities)
                        }
                    }
                }
            }
        },
        created(){

            this.initFun();
            
        }
        
    }

    
</script>

<!-- CSS 样式 -->
 <style src="static/css/oold_common.css"></style>
 <style src="static/css/city.css"></style>



