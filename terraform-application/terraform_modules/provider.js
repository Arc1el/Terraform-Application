exports.getProviders = function (){
    return ` 
    terraform {
        required_providers {
            aws = {
                source  = "hashicorp/aws"
                version = "~> 4.22"
            }
        }
    }
    provider "aws" { # AWS Provider
        region  = "ap-northeast-2"
        profile = "default"
        assume_role {
            role_arn = ""
        }
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
}

