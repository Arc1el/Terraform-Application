exports.logSeperate = function(data) {
    const socket = data.socket;
    const msg = data.msg;
    
    socket.emit('log_health', "==============================================\n");
    socket.emit('log_health', msg + "\n");
    socket.emit('log_health', "==============================================\n");
}

exports.logging = function(data) {
    const socket = data.socket;
    const msg = data.msg;
    socket.emit('log_health', msg + "\n");
}