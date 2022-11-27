const fs = require("fs")
const path = require('path')


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

exports = module.exports = {
    loadRpaConfig : loadRpaConfig
}