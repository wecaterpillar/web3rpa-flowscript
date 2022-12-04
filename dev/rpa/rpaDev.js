const fs = require("fs")
const path = require('path')
const log = require('electron-log')

const dataUtil = require('./dataUtil')
const browserUtil = require('./browserUtil')


const rpaConfig = {}

const loadRpaConfig = async () => {
    let  devConfig
    // load rpaConfig from dev.json
    let configPath = './dev/rpa/dev.json'
    if (fs.existsSync(configPath)) {
        let configStr = fs.readFileSync(configPath)
        devConfig = JSON.parse(configStr)
        //console.debug(devConfig)
    }
    return devConfig
}

const runRpaDemo = () => {
    const {flow_start} = require('../../flowscript/demo-baidu/baidu-visit')
    let item = {}
    let browser = {"browserKey":"demo01"}
    item['browser'] = browser
    flow_start({item})
}

const runProjectScript = async ({projCode,scriptName}) =>{
    const {flow_start} = require('../../flowscript/'+projCode+'/'+scriptName)
    let projectResult
    let result = await dataUtil.getListData('w3_project_auto', {'code':projCode})
    if(result && result.records){
        projectResult = result.records[0]
    }
    console.debug(projectResult)
    if(projectResult && 'id' in projectResult){
        result = await dataUtil.getListData('w3_project_account',{'project_id':projectResult['id']})
        if(!!result && result.records){
            for(i in result.records){
                // 账号处理
                let item = result.records[i]
                // project
                item['project'] = projCode
                item['project_code'] = projCode
                // 'w3_browser' - browserid
                let browserInfo = await dataUtil.getBrowserInfo({browserId:item['browser_id']})
                if(browserInfo){
                    browserInfo['browserKey'] = browserInfo['name']
                    item['browser'] = browserInfo
                }
                // invoke
                await flow_start({item, rpaConfig:getSimpleRpaConfig()})
            }
        }
    }else{
        console.debug("no project found, test with demo")
        // no project found
        let item = {}
        let browserInfo = {"browserKey":"demo05"}
        item['browser'] = browserInfo
        await flow_start({item, rpaConfig})
    }
}

const getSimpleRpaConfig = () => {
    // 复制必要的rpaConfig 配置信息
    let rpaConfigJson = {}
    rpaConfigJson.isMac = rpaConfig.isMac
    rpaConfigJson.isLinux = rpaConfig.isLinux
    // 数据目录
    rpaConfigJson.appDataPath = rpaConfig.appDataPath
    // local api
    return rpaConfigJson
}

const startRpa = async () => {
    console.debug('start rpa ...')
    //console.debug(rpaConfig)

    // 1. load rpa config
    let devConfig = await loadRpaConfig()
    if(!!devConfig){
        Object.assign(rpaConfig, devConfig)
    }
    console.debug(rpaConfig)

    // 2. init
    // 2.1 dataUtil
    dataUtil.dataUtilInit(rpaConfig)

    // 2.2 browser
    browserUtil.browserInit(rpaConfig)

    // 3. rpa dev?
    //runRpaDemo()
    // 开发过程中可配置不同的项目和脚本
    runProjectScript({
        projCode:'demo-baidu',
        scriptName:'baidu-visit'
    })
}


startRpa()