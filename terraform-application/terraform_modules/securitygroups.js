var fs = require('fs');

exports.createSecurityGroup = function(data) {
    const region        = data.region;
    const access_key    = data.access_key;
    const secret_key    = data.secret_key;
    // const arn           = data.arn;

    const title = data.title;
    const sg_name = data.sg_name;
    const description = data.description;

    const ingress = data.ingress;
    const egress = data.egress;

    console.log("ingress 0  : ", ingress[0])

    
    // !fs.existsSync(access_key) && fs.mkdirSync(access_key);

    try{
        var providers_code = `resource "aws_security_group" "${sg_name}" {
vpc_id = module.vpc.vpc_id
name = "${title}-prod-{sg_name}"
description = "${description}"
egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
}
lifecycle {
    create_before_destroy = true
}


tags = {
    Name = "sg-${local.name}-prod-test"
    Env  = local.env_name
}
}
`
    return providers_code;
    }catch(e){
        console.log(e);
    }finally{
    }
};