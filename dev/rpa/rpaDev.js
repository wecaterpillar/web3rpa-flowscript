const fs = require("fs")
const path = require('path')

const { remoteServerInit } = require('./remoteServer')
const { browserInit } = require('./browser')
const { dataUtilInit, getListData, getDetailData, updateDetailData, createDetailData, getRpaPlanTaskList} = require('./dataUtil')


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

const runProjectScript = async ({projctCode,scriptName}) =>{
    const {flow_start} = require('../../flowscript/'+projctCode+'/'+scriptName)
    // TODO query project account
    let projectInfo
    let queryParams = {}
    queryParams['code'] = projctCode
    let result = await getListData('w3_project_auto', queryParams)
    if(!!result && result.records){
        projectInfo = result.records[0]
    }
    if(!!projectInfo && 'id' in projectInfo){
        queryParams = {}
        queryParams['project_id'] = projectInfo['id']
        result = await getListData('w3_project_account',queryParams)
        if(!!result && result.records.length>0){
            for(i in result.records){
                // 账号处理
                let item = result.records[i]
                // project
                item['project'] = projectResult['code']
                item['project_code'] = projectResult['code']
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
        // no project found
        let item = {}
        let browser = {"browserKey":"demo01"}
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
    //console.debug(rpaConfig)

    // 2. init
    // 2.1 dataUtil
    dataUtilInit(rpaConfig)

    // 2.2 browser
    browserInit(rpaConfig)

    // 3. rpa dev?
    //runRpaDemo()
    runProjectScript({projctCode:'demo-baidu',scriptName:'baidu-visit'})
}

startRpa()