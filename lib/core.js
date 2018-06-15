var express = require('express');
var watch = require('watch');
var path = require('path');
var util = require('./util');
const RULE = /\.(js|html|es6|css|less)$/;

module.exports = {
    //配置信息
    config: {},
    //socketo
    io: {},
    //检测文件是否支持热更新
    checkFile: function(file) {
        return RULE.test(file);
    },
    //启动监视文件
    initWatch: function() {
        var config = this.config;
        var fullDirs = [];
        var watchDirs = Array.isArray(config.watchDirs) ? config.watchDirs : config.watchDirs.split(',');
        watchDirs.forEach(function (item) {
            fullDirs.push(path.resolve(item));
        });
        fullDirs.forEach(item => {
            watch.createMonitor(item.trim(), monitor => {
                this.setMonitor(monitor);
            });
        });
    },
    //只监听文件的changed事件
    setMonitor: function(monitor) {
        monitor.files['.zshrc'];
        monitor.on('changed', (file, curr, prev) => {
            if (!this.checkFile(file)) {
                return;
            }
            console.log(util.getLogMsgPrefix(), 'File changed:' + file);
            this.io.emit('webhot', file);
        });
    },
    //初始化
    init: function(conf) {
        this.config = conf;
        var app = express();
        app.use(express.static(path.resolve(__dirname, '../src')));
        var server = require('http').createServer(app);
        // 启动socket.io服务
        this.io = require('socket.io')(server);
        this.io.on('connection', function (socket) {
            socket.emit('welcome');
        });
        // 启动文件监听
        this.initWatch();
        //启动web server
        server.listen(conf.port, function () {
            var msg = [
                '======================\n',
                '[WEB-HOT] Server started at http://127.0.0.1:%d\n',
                '[WEB-HOT] Enjoy it!\n',
                '======================\n'
            ].join('');
            console.log(msg, conf.port);
        });
        return app;
    }
}

