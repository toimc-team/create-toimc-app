const axios = require('axios');
const { GIT_BASE, GIT_TYPE, GIT_NAME } = require('./constant');

axios.interceptors.response.use(res=>{
  return res.data
})

if(process.env.HTTP_PROXY){
  if(process.env.HTTP_PROXY.startsWith("http")){
    let tmp = process.env.HTTP_PROXY.split("://")
    axios.default.proxy = {
      protocol: tmp[0],
      host: tmp[1].split(':')[0],
      port: tmp[1].split(':')[1]
    }
  }
}

// 获取模板列表
function getRepoList(){
  return axios.get(`${GIT_BASE}/${GIT_TYPE}/${GIT_NAME}/repos`)
}

// 获取版本列表
function getTagList(repo){
  return axios.get(`${GIT_BASE}/repos/${GIT_NAME}/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}