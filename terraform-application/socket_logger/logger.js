exports.logSeperate = function(data) {
    const socket = data.socket;
    const msg = data.msg;
    
    socket.emit('log_health', "===========================================");
    socket.emit('log_health', msg + "");
    socket.emit('log_health', "===========================================");
}

exports.logging = function(data) {
    const socket = data.socket;
    const msg = data.msg;
    socket.emit('log_health', msg + "\n");
}

exports.tfLogging = function(data) {
    const socket = data.socket;
    const msg = data.msg;
    socket.emit('tf_log', msg);
}