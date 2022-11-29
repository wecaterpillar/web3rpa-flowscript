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
    const {flow_start} = require('../../proj-script/demo-baidu/baidu-visit')
    let item = {}
    let browser = {"browserKey":"demo01"}
    item['browser'] = browser
    flow_start({item})
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
    runRpaDemo()

}

startRpa()