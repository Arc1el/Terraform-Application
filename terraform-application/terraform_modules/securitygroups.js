var fs = require('fs');

exports.createSecurityGroup = function(data) {
    const access_key    = data.access_key;
    const title    = data.title;
    const sg_name = data.sg_name;
    const description = data.description;
    const ingress = data.ingress;
    const egress = data.egress;

    console.log("ingress 0  : ", ingress[0])
    // !fs.existsSync(access_key) && fs.mkdirSync(access_key);

    try{
        var sg_code = `resource "aws_security_group" "${sg_name}" {
    vpc_id = module.vpc.vpc_id
    name = "${title}-prod-${sg_name}"
    description = "${description[0]}"
    ingress {
        description = "${ingress[0][0]}"
        from_port = ${ingress[0][1]}
        to_port = ${ingress[0][2]}
        protocol = "${ingress[0][3]}"`


        if(!ingress[0][4] == ""){
            sg_code += `
        cidr_blocks = ["${ingress[0][4]}"]`
        }
        
        sg_code += `
    }
    egress {
        description = "${egress[0][0]}"
        from_port = ${egress[0][1]}
        to_port = ${egress[0][2]}
        protocol = "${egress[0][3]}"`


        if(!egress[0][4] == ""){
            sg_code += `
        cidr_blocks = ["${egress[0][4]}"]`
        }
        
        sg_code += `
    }
    lifecycle {
        create_before_destroy = true
    }


    tags = {
        Name = "sg-${title}-prod-test"
        Env  = "test"
    }
}
    `
    return sg_code;
    }catch(e){
        console.log(e);
    }finally{
    }
};