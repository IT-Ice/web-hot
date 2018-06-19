const express = require('express');
const watch = require('watch');
const path = require('path');
const util = require('./util');
const fs = require('fs');

module.exports = {
    //配置信息
    config: {},
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
            console.log(util.getLogMsgPrefix(), 'File changed:' + file);
            console.log(file)
            this.io.emit('webhot', file);
        });
    },
    //启动路由匹配
    mateRoute: function() {
        this.app.get('*.html', (req, res,next)=>{
            let filePath = path.resolve(__dirname, `../src/${req.url}`);
            let content = fs.readFileSync(filePath, 'utf-8');
            let script = `<script src="/socket.io/socket.io.js" type="text/javascript"></script>
                <script>
                    var socket = io('http://${this.config.server}');
                    socket.on('webhot', function () {
                        location.reload();
                    }); 
                </script>`;
            content = content + script;
            res.set('content-type', 'text/html; charset=utf-8');
            res.send(content);
        });
    },
    //设置静态路径
    staticResource: function() {
        this.app.use(express.static(path.resolve(__dirname, this.config.staticDir)));
    },
    //创建server
    createServer: function() {
        this.server = require('http').createServer(this.app);
    },
    //创建Socket
    createSocket: function() {
        this.io = require('socket.io')(this.server);
    },
    //初始化
    init: function(conf) {
        this.config = conf;
        this.app = express();
        this.mateRoute();
        this.staticResource();
        this.createServer();
        this.createSocket();
        this.initWatch();
        this.server.listen(conf.port, () => {
            let msg = [
                '******************************************************\n',
                '*                                                    *\n',
                '* [WEB-HOT] Server started at http://127.0.0.1:%d  *\n',
                '* [WEB-HOT] Enjoy it!                                *\n',
                '*                                                    *\n',
                '******************************************************\n'
            ].join('');
            console.log(msg, conf.port);
        });
    }
}

