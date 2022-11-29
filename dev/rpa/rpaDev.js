const fs = require("fs")
const path = require('path')


const rpaConfig = {}

const startRpa = async () => {
    console.debug('start rpa ...')
    console.debug(rpaConfig)

    // 1. load rpa config
    let devConfig = await loadRpaConfig()
    if(devConfig){
        Object.assign(rpaConfig, devConfig)
    }

    // 2. init
    // 2.1 dataUtil
    await dataUtilInit(rpaConfig)

    // 2.2 browser
    await browserInit(rpaConfig)

    // 3. rpa dev?
}

await startRpa()

const loadRpaConfig = async () => {
    let  rpaConfig
    // load rpaConfig from dev.json
    await (async () => {
        let configPath = './dev.json'
        if (fs.existsSync(configPath)) {
            let configStr = fs.readFileSync(configPath)
            rpaConfig = JSON.parse(configStr)
        }
    })()
    return rpaConfig
}