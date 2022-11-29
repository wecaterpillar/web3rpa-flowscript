## 如何使用

### 流程脚本代码管理
- 当前   
开发人员维护playwright流程脚本到本git项目，发布时复制代码到 w3Rpa系统的流程脚本中

- 未来  
  w3Rpa系统的流程脚本配置git地址，自动抓取main分支的脚本

### 本地运行
- 启动electron   
开发模式或生产模式都行，有localAPI就行。
- 执行命令启动  
yarn install  
yarn start

## 目录结构说明
- dev 本地开发共用文件 
  - rpa 所需引入文件 - 依赖本地electron App和localAPI  
- lib 发布版本共用文件  
共用文件的根路径可能在开发环境和生产环境不同，会在生产环境部署时统一替换    
  - rpa 所需引入文件  
- 定制项目流程脚本
  - 【项目代码】
    - 脚本文件名