import KCcore from './KCcore'

class KCdeviceApi extends KCcore{
    
    /**
     * 开启手机GPS
     * @return {[type]} [description]
     */
    openGPSSetting (){
        this.sendData({
            method:"openGPSSetting",
            param:{
                info:'openGPSSetting'
            }
        });
    }
	/**
     * 开启手机GPS
     * @return {[type]} [description]
     */
    copyToClipboard (content, callBack){
        this.sendData({
            method:"copyToClipboard",
            param:{
                "content": content
            },
            callBack: callBack
        });
    }
    /**
     * 开启手机网络权限
     * @return {[type]} [description]
     */
    openNetPermissionSetting (){
        this.sendData({
            method:"openNetPermissionSetting",
            param:{
                info:'openNetPermissionSetting'
            }
        });
    };
    /**
     * 开启手机网络设置
     * @return {[type]} [description]
     */
    openSetting (){
        this.sendData({
            method:"openSetting",
            param:{
                info:'openSetting'
            }
        });
    };
}

export default new KCdeviceApi({
    name: "deviceApi",
    author: "liusi",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "deviceApi"
})