 //添加日志前缀
 function getLogMsgPrefix()  {
    return `[WEB-HOT] ${(new Date()).toLocaleString()}`
}

module.exports = {
    getLogMsgPrefix: getLogMsgPrefix
}