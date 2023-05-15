exports.createVpc = function() {
    try{
        var vpc_code = ` 
    module "vpc" {
        source = "git::ssh://git-codecommit.ap-northeast-2.amazonaws.com/v1/repos/terraform//modules//vpc"
        vpc    = [{ 
            name = "01.vpc-testname-prod" 
            cidr = "10.0.0.0/16" 
        }]
        subnet = [
            {name="01.sub-testname-prod-pub-a-01", cidr = "10.0.1.0/24",default_gateway = "igw" },
            {name="02.sub-testname-prod-pub-c-01", cidr = "10.0.2.0/24",default_gateway = "igw" },
            {name="03.sub-testname-prod-pri-a-01", cidr = "10.0.11.0/24",default_gateway = "non" },
            {name="04.sub-testname-prod-pri-c-01", cidr = "10.0.22.0/24", default_gateway = "non" },
            {name="05.sub-testname-prod-db-a-01", cidr = "10.0.31.0/24", default_gateway = "non" },
            {name="06.sub-testname-prod-db-c-01", cidr = "10.0.32.0/24", default_gateway = "non" },
        ]
        igw = true 
        nat = ["01.sub-testname-prod-pub-a-01", "02.su b-testname-prod-pub-c-01"]
        tags = { 
            Env  = "test"
        }
    } 
        `
    }catch(e){
        console.log(e);
    }finally{
        return vpc_code;
    }
};