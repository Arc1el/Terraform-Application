exports.createVpc = function(data) {
    const access_key    = data.access_key;
    const title         = data.title;
    const vpc_cidr      = `"${data.vpc_cidr}"`;
    const pub           = data.public_subnet_data;
    const priv          = data.private_subnet_data;
    const db            = data.database_subnet_data;
    const nat           = data.nat_gateway_data;

    let nat_context = "[";
    for (var i = 0; i <nat.length; i++) {
        let target_subnet = pub[nat[i]]; 
        nat_context += `"0${target_subnet.index + 1}.sub-${title}-prod-pub-${target_subnet.az}-01", ` 
    }
    nat_context += "]";

    let subnet_context = [];
    for (var i = 0; i < pub.length; i++)
        subnet_context.push(`sub-${title}-prod-pub-${pub[i].az}-01", cidr = "${pub[i].cidr}", default_gateway = "${pub[i].gateway}"`)
    for (var i = 0; i < priv.length; i++)
        subnet_context.push(`sub-${title}-prod-priv-${priv[i].az}-01", cidr = "${priv[i].cidr}", default_gateway = "${priv[i].gateway}"`)
    for (var i = 0; i < db.length; i++)
        subnet_context.push(`sub-${title}-prod-db-${db[i].az}-01", cidr = "${db[i].cidr}", default_gateway = "${db[i].gateway}"`)


    let subnet_len = subnet_context.length;
    let subnet_str = "subnet = [\n"
    for (var i = 0; i < subnet_len; i++)
        subnet_str += `            {name="0${i+1}.${subnet_context[i]}},\n`;
    subnet_str+= "            ]\n"

    try{
        var vpc_code = `module "vpc" {
    source = "git::ssh://git-codecommit.ap-northeast-2.amazonaws.com/v1/repos/terraform//modules//vpc"
    vpc    = [{ 
        name = "01.vpc-${title}-prod",
        cidr = ${vpc_cidr}
    }]
    ${subnet_str}
    igw = true 
    nat = ${nat_context}
    tags = { 
        Env  = "test"
    }
}
`
        return vpc_code;
    }catch(e){
        console.log(e);
    }finally{
    }
};