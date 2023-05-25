const { spawn } = require('child_process');
const logger = require('../socket_logger/logger');

function convertANSIEscapeSequences(text) {
    var html = text.replace(/\u001b\[(\d+)m/g, function(match, p1) {
        var style = '';
            switch (parseInt(p1)) {
                case 31: // 빨강
                    style = 'color: red';
                break;
                case 32: // 초록
                    style = 'color: green';
                break;
            }
        return '<span style="' + style + '">';
    });
    html = html.replace(/\u001b\[0m/g, '</span>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/\t/g, '<span style="display: inline-block; width: 4ch;"></span>');
    return html;
}

exports.validate = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path + "/" + data.title;
    const terraform_init = spawn('terraform', [`-chdir=${tf_file_path}`,'validate']);
    terraform_init.stdout.on('data', (data) => {
        console.log(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_init.stderr.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_init.on('exit', (code) => {
        if (code === 0) console.log('Terraform version succeeded');
        else console.error('Terraform version failed');
    });
}

exports.init = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path + "/" + data.title;
    const terraform_init = spawn('terraform', [`-chdir=${tf_file_path}`, 'init']);
    terraform_init.stdout.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_init.stderr.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_init.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Initialiation Successfully"});
        else console.error('Terraform init failed');
    });
};

exports.plan = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path + "/" + data.title;
    const terraform_plan = spawn('terraform', [`-chdir=${tf_file_path}`, 'plan']);
    terraform_plan.stdout.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_plan.stderr.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_plan.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Plan Successfully"});
        else console.error('Terraform plan failed');
    });
};

exports.apply = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path + "/" + data.title;
    const terraform_apply = spawn('terraform', [`-chdir=${tf_file_path}`, 'apply', '-auto-approve']);
    terraform_apply.stdout.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_apply.stderr.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_apply.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Apply Successfully"});
        else console.error('Terraform apply failed');
    });
};

exports.destroy = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path + "/" + data.title;
    const terraform_destroy = spawn('terraform', [`-chdir=${tf_file_path}`, 'destroy', '-auto-approve']);
    terraform_destroy.stdout.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_destroy.stderr.on('data', (data) => {
        console.error(data.toString());
        socket.emit('tf_log', convertANSIEscapeSequences(data.toString())); 
    }); 
    terraform_destroy.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Destroy Successfully"});
        else console.error('Terraform apply failed');
    });
}