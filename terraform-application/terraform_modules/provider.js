var fs = require('fs');

exports.createProviders = function(data) {
    const region        = data.region;
    const access_key    = data.access_key;
    const secret_key    = data.secret_key;
    const title       = data.title;
    // const arn           = data.arn;
    
    // !fs.existsSync(access_key) && fs.mkdirSync(access_key);

    try{
        var providers_code = `terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 4.22"
        }
    }
}
provider "aws" { # AWS Provider
    region     = "${region}"
    access_key = "${access_key}"
    secret_key = "${secret_key}"
}
provider "aws" {   
    alias  = "virginia" 
    region = "us-east-1"
}
provider "aws" {    
    alias  = "tokyo" 
    region = "ap-northeast-1"
}
provider "local" {}
`
    return providers_code;
    }catch(e){
        console.log(e);
    }finally{
    }
};