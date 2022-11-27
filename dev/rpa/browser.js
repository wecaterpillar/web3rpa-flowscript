const playwright = require('playwright')

const fs = require("fs")
const path = require('path')

const {loadRpaConfig} = require('./rpaLoad')
const rpaConfig = loadRpaConfig()

const browserDefaultConfig = {
    //indexUrl: 'https://www.sogou.com',  //主页地址
    options: {
        headless: false, //是否无头浏览器
        ignoreDefaultArgs: ['--enable-automation']
    }
}

const getBrowserExtensions = (extensions) => {
    // TODO 插件配置检查,以及配置文件是否存在
    // 插件服务下载后解压
    // https://playwright.dev/docs/chrome-extensions
    var  browserExtensions = [
        //path.join(rpaConfig.appDataPath, 'lib/extensions/metamask-chrome-10.22.2')   //MetaMask
    ]
    return browserExtensions
}

const getBrowserExecutablePath = (browserType, version, browserName) => {
    // 浏览器执行文件检查
    //浏览器 版本优先级 1 浏览器配置指定 2 playwright默认配置 3 系统默认配置
    // https://playwright.dev/docs/browsers
    let executablePath;
    if(rpaConfig.isMac){
        // 1 浏览器配置指定
        //executablePath: path.join(rpaConfig.appDataPath, 'lib/chrome_105/SunBrowser.app/Contents/MacOS/SunBrowser'),
        //executablePath: path.join(rpaConfig.appDataPath, 'lib/chrome_107/BraveBrowser.app/Contents/MacOS/Brave Browser'),
        let bravePath = path.join(rpaConfig.appDataPath, 'lib/chrome_107/BraveBrowser.app/Contents/MacOS/Brave Browser')
        // 2 playwright默认配置
        // ~/Library/Caches/ms-playwright/chromium-1028/chrome-mac/Chromium.app
        // 3 系统默认配置
        let chromeDefault = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        if(fs.existsSync(bravePath)){
            executablePath = bravePath;
        }else if(fs.existsSync(chromeDefault)){
            executablePath = chromeDefault
        }
    }else if(rpaConfig.isLinux){

        // ~/.cache/ms-playwright

    }else{
        //win32

        // %USERPROFILE%\AppData\Local\ms-playwright

    }
    return executablePath;
}

const getBrowserUserDataDir = (browserKey) => {
    // 默认目录如何处理，固定default或者不指定
    if(!!browserKey){
        return path.join(rpaConfig.appDataPath, '/userData/'+browserKey)
    }
    return
}

const getBrowserConfig = async (config) => {
    var browserConfig = {}
    Object.assign(browserConfig, browserDefaultConfig)
    if(config){
        Object.assign(browserConfig, config)
    }
    // check browserKey/browserId
    let browserKey
    if('browserKey' in browserConfig){
        browserKey = browserConfig['browserKey']
    }else if('browserId' in browserConfig){
        browserKey = browserConfig['browserId']
        browserConfig['browserKey'] = browserKey
    }

    // 输入config转换为指纹的options,参考ads


    // check headless
    browserConfig.options.headless = false

    // check extension
    let extensions = getBrowserExtensions()
    if(!!extensions && extensions.length>0){
        browserConfig.options.args = [
            '--disable-blink-features=AutomationControlled',
            `--disable-extensions-except=${extensions}`,
            `--load-extension=${extensions}`
        ]
    }else{
        browserConfig.options.args = ['--disable-blink-features=AutomationControlled']
    }

    // check executablePath
    let executablePath = getBrowserExecutablePath('chrome', 107, 'brave')
    if(!!executablePath){
        browserConfig.options.executablePath = executablePath
    }

    // check browserUserDataDir
    let browserUserDataDir = getBrowserUserDataDir(browserKey)
    if(!!browserUserDataDir){
        browserConfig.userDataDir = browserUserDataDir
    }

    console.debug(browserConfig);

    return browserConfig
}

const launchBrowserContext =  async (browserConfig) => {
    // load context
    let context
    let browserKey
    let browserUserDataDir
    if(!!browserConfig && 'browserKey' in browserConfig){
        browserKey = browserConfig.browserKey
        if(!!browserConfig.userDataDir){
            browserUserDataDir = browserConfig.userDataDir
        }
    }
    console.debug(browserConfig);
    if(!!browserUserDataDir){
        context = await playwright.chromium.launchPersistentContext(browserUserDataDir, browserConfig.options);
    }else{
        const browser = await playwright.chromium.launch(browserConfig.options)
        context = await browser.newContext()
    }
    return context
}

const closeBrowserContext = async (context) => {
    // https://playwright.dev/docs/api/class-browsercontext#browser-context-close
    if(!!context){
        let browser = context.browser()
        context.close()
        if(!!browser){
            browser.close()
        }
    }
}

exports = module.exports = {
    getBrowserConfig : getBrowserConfig,
    launchBrowserContext : launchBrowserContext,
    closeBrowserContext : closeBrowserContext
}