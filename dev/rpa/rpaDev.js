const fs = require("fs")
const path = require('path')

const { remoteServerInit } = require('./remoteServer')
const { browserInit } = require('./browser')
const { dataUtilInit, getListData, getDetailData, updateDetailData, createDetailData, getRpaPlanTaskList,getBrowserInfo} = require('./dataUtil')


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
    // TODO query project account
    let projectResult
    let result = await getListData('w3_project_auto', {'code':projCode})
    console.debug(result)
    if(result && result.records){
        projectResult = result.records[0]
    }
    console.debug(projectResult)
    if(projectResult && 'id' in projectResult){
        result = await getListData('w3_project_account',{'project_id':projectResult['id']})
        if(!!result && result.records){
            for(i in result.records){
                // 账号处理
                let item = result.records[i]
                // project
                item['project'] = projCode
                item['project_code'] = projCode
                // 'w3_browser' - browserid
                let browser = await getBrowserInfo({browserId:item['browser_id']})
                if(browser){
                    browser['browserKey'] = browser['name']
                    item['browser'] = browser
                }
                // invoke
                flow_start({item})
            }
        }
    }else{
        console.debug("no project found, test with demo")
        // no project found
        let item = {}
        let browser = {"browserKey":"demo05"}
        item['browser'] = browser
        flow_start({item})
    }
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
    dataUtilInit(rpaConfig)

    // 2.2 browser
    browserInit(rpaConfig)

    // 3. rpa dev?
    //runRpaDemo()
    runProjectScript({projCode:'demo-baidu',scriptName:'baidu-visit'})
}

startRpa()