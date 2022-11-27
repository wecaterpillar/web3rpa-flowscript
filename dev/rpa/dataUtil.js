const axios = require('axios')

const {loadRpaConfig} = require('./rpaLoad')
const rpaConfig = await loadRpaConfig()

let localApiBase = rpaConfig['localApi']

const  getListData =  async (tableKey, queryParams = {}) => {
    let url = localApiBase + '/api/getData/'+tableKey
    return await axios.get(url, queryParams)
}

const  getDetailData =  async (tableKey, detailId) => {
    let url = localApiBase + '/api/detail/'+tableKey+'/'+detailId
    return await axios.get(url)
}

const updateDetailData = async (tableKey, data) => {
    let url = localApiBase + '/api/form/'+tableKey
    return await axios.put(url, data)
}

const createDetailData = async (tableKey, data) => {
    let url = localApiBase + '/api/form/'+tableKey
    return await axios.post(url, data)
}

exports = module.exports = {
    getListData : getListData,
    getDetailData : getDetailData,
    updateDetailData : updateDetailData,
    createDetailData : createDetailData
}
