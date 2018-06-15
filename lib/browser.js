var config = require('./config');
var util = require('./util');
var socketio = require('./socket.io/socket.io');
(function(){
    
    var socket = io('http://127.0.0.1:9018');
    // 建立连接
    socket.on('welcome', function () {
        console.log('HotUpdate已启动！');
    });

    socket.on('webhot', function () {
        location.reload();
    });
    
})();