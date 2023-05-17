const { spawn } = require('child_process');
const logger = require('../socket_logger/logger');

function removeANSI(text){
    var pattern = /\u001b\[[0-9;]*m/g;
    return text.replace(pattern, ''); 
}

exports.version = function (data) {
    const socket = data.socket;
    const terraform_init = spawn('terraform', ['-v']);
    terraform_init.stdout.on('data', (data) => {
        console.log(data.toString());
        socket.emit('log_health', data.toString()); 
    }); 
    terraform_init.stderr.on('data', (data) => {
        console.error(data.toString());
    }); 
    terraform_init.on('exit', (code) => {
        if (code === 0) console.log('Terraform version succeeded');
        else console.error('Terraform version failed');
    });
}

exports.init = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path;

    const terraform_init = spawn('terraform', [`-chdir=${tf_file_path}`, 'init']);
    terraform_init.stdout.on('data', (data) => {
        console.log(data.toString());
        socket.emit('log_health', removeANSI(data.toString())); 
    }); 
    terraform_init.stderr.on('data', (data) => {
        console.error(data.toString());
    }); 
    terraform_init.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Initialiation Successfully"});
        else console.error('Terraform init failed');
    });
};

exports.plan = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path;

    const terraform_plan = spawn('terraform', [`-chdir=${tf_file_path}`, 'plan']);
    terraform_plan.stdout.on('data', (data) => {
        console.log(data.toString());
        socket.emit('log_health', removeANSI(data.toString())); 
    }); 
    terraform_plan.stderr.on('data', (data) => {
        console.error(data.toString());
    }); 
    terraform_plan.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Plan Successfully"});
        else console.error('Terraform plan failed');
    });
};

exports.apply = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path;

    const terraform_apply = spawn('terraform', [`-chdir=${tf_file_path}`, 'apply', '-auto-approve']);
    terraform_apply.stdout.on('data', (data) => {
        console.log(data.toString());
        socket.emit('log_health', removeANSI(data.toString())); 
    }); 
    terraform_apply.stderr.on('data', (data) => {
        console.error(data.toString());
    }); 
    terraform_apply.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Apply Successfully"});
        else console.error('Terraform apply failed');
    });
};

exports.destroy = function (data) {
    const socket = data.socket;
    let tf_file_path = "./tf_files/" + data.path;

    const terraform_destroy = spawn('terraform', [`-chdir=${tf_file_path}`, 'destroy', '-auto-approve']);
    terraform_destroy.stdout.on('data', (data) => {
        console.log(data.toString());
        socket.emit('log_health', removeANSI(data.toString())); 
    }); 
    terraform_destroy.stderr.on('data', (data) => {
        console.error(data.toString());
    }); 
    terraform_destroy.on('exit', (code) => {
        if (code === 0) logger.logSeperate({socket, msg:"Terraform Destroy Successfully"});
        else console.error('Terraform apply failed');
    });
}