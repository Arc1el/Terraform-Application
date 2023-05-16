$(document).ready(function() {
    const socket = io();
    var table_pub_subnets = $("#pub_subnet_tr");
    var table_priv_subnets = $("#priv_subnet_tr");
    var table_db_subnets = $("#table_db_subnets");
    var table_nat_gateways = $("#table_nat_gateways");
    socket.on('log_health', function(data) {
        console.log(data);
        var textarea_str = $("#log-health").val();
        console.log(textarea_str);
        textarea_str += data;
        $("#log-health").html(textarea_str); 
    }); 
    document.querySelector('#health_check_form').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("asdfadsf");
        socket.emit('health_check', {});
    });

    document.querySelector('#config-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const access_key = $('#access_key').val();
        const secret_key = $('#secret_key').val();
        const region = $('#region').val();
        const arn = $('#arn').val();
        const project = $('#project').val();

        console.log("config-form data : ", access_key, secret_key, arn, project, region);

        socket.emit('create_providers', {access_key, secret_key, region, project, arn}); 
    });

    document.querySelector('#vpc-form').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("clicked");
        console.log("vpc-form submit clicked");
        var title = $('#project').val(); 
        var vpc_cidr = $('#vpc_cidr').val();
        if (!vpc_cidr) vpc_cidr = '10.0.0.0/16';
        const public_subnet_count = $('#select_pub_subnets').val();
        const private_subnet_count = $('#select_priv_subnets').val();
        const database_subnet_count = $('#select_db_subnets').val();
        const nat_count = $('#select_nat_gateway').val();
        const access_key = $('#access_key').val();
        console.log("nat_count : ", nat_count);

        var public_subnet_data = [];
        for (let i = 0; i < public_subnet_count; i++) {
            let az = $(`#select_pub_az_${i}`).val();
            let cidr = $(`#pub_subnet_${i}_cidr`).val();
            console.log(cidr);
            if (!cidr) cidr = `10.0.${i+1}.0/24`;
            let gate = $(`#select_pub_subnets_${i}`).val();
            let data = {index: i, az: az, cidr: cidr, gateway: gate}
            public_subnet_data.push(data);
        }
        var private_subnet_data = [];
        for (let i = 0; i < private_subnet_count; i++) {
            let az = $(`#select_priv_az_${i}`).val();
            let cidr = $(`#priv_subnet_${i}_cidr`).val();
            console.log(cidr);
            if (!cidr) cidr = `10.0.2${i+1}.0/24`;
            let gate = $(`#select_priv_subnets_${i}`).val();
            let data = {index: i, az: az, cidr: cidr, gateway:gate}
            private_subnet_data.push(data);
        }
        var database_subnet_data = [];
        for (let i = 0; i < database_subnet_count; i++) {
            let az = $(`#select_db_az_${i}`).val();
            let cidr = $(`#db_subnet_2${i}_cidr`).val();
            console.log(cidr);
            if (!cidr) cidr = `10.0.3${i+1}.0/24`;
            let gate = $(`#select_db_subnets_${i}`).val();
            let data = {index: i, az: az, cidr: cidr, gateway:gate}
            database_subnet_data.push(data); 
        }
        var nat_gateway_data = [];
        for (let i = 0; i < nat_count; i++) {
            let created_subnet = $(`#select_nat_gateway_subnets_${i}`).val();
            console.log("created subnet : ", created_subnet);
            nat_gateway_data.push(created_subnet);
        }
        // console.log(public_subnet_data);
        // console.log(private_subnet_data);
        // console.log(database_subnet_data);
        console.log(nat_gateway_data);
        socket.emit('create_vpc', {access_key, title, vpc_cidr, public_subnet_data, private_subnet_data, database_subnet_data, nat_gateway_data});
    });

    $("#select_pub_subnets").change(function() {
        table_pub_subnets.html("");
        table_nat_gateways.html("");
        let len = $(this).val();
        for (var i = 0; i <len; i++) {
            table_pub_subnets.append(`
            <tr>
                <td>
                    Public_${i}
                </td>
                <td>
                    <select name ="az" id="select_pub_az_${i}">
                        <option value = a selectd>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>
                </td>
                <td>
                    <input class="gen_sub_input_cidr" placeholder="10.0.${i+1}.0/24" type="text" name="cidr" id="pub_subnet_${i}_cidr">
                </td>
                <td>
                <select name ="pub" id="select_pub_subnets_${i}">
                    <option value = non >None</option>
                    <option value = igw selected>Internet Gateway</option>
                    <option value = nat>Nat Gateway</option>
                </select>
                </td>
            </tr>
            `) 
        }
    });

    $("#select_priv_subnets").change(function() {
        table_priv_subnets.html("");
        let len = $(this).val();
        for (var i = 0; i <len; i++) {
            table_priv_subnets.append(`
            <tr>
                <td>
                    Private_${i}
                </td>
                <td>
                    <select name ="az" id="select_priv_az_${i}">
                        <option value = a selectd>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>
                </td>
                <td>
                    <input class="gen_sub_input_cidr" placeholder="10.0.2${i+1}.0/24" type="text" name="cidr" id="priv_subnet_${i}_cidr">
                </td>
                <td>
                <select name ="priv" id="select_priv_subnets_${i}">
                    <option value = non >None</option>
                    <option value = igw >Internet Gateway</option>
                    <option value = nat selected>Nat Gateway</option>
                </select>
                </td>
            </tr>
            `)
        }
    });

    $("#select_db_subnets").change(function() {
        table_db_subnets.html("");
        let len = $(this).val();
        for (var i = 0; i <len; i++) {
            table_db_subnets.append(`
            <tr>
                <td>
                    DB_${i}
                </td>
                <td>
                    <select name ="az" id="select_db_az_${i}">
                        <option value = a selectd>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>
                </td>
                <td>
                    <input class="gen_sub_input_cidr" placeholder="10.0.3${i+1}.0/24" type="text" name="cidr" id="db_subnet_${i}_cidr">
                </td>
                <td>
                <select name ="pub" id="select_db_subnets_${i}">
                    <option value = non selected>None</option>
                    <option value = igw>Internet Gateway</option>
                    <option value = nat>Nat Gateway</option>
                </select>
                </td>
            </tr>
            `)
        }
    });

    $("#select_nat_gateway").change(function() {;
        table_nat_gateways.html("");
        let len = $(this).val();
        console.log(len);
        let pub_len = $("#select_pub_subnets").val();
        console.log(pub_len);     
        for (var i = 0; i < len; i++) {
            opt = "";
            for (var j = 0; j <pub_len; j++) {
                opt +=`<option value="${j}">Public_Subnet_${j}</option>`
            };
            console.log("opt : ", opt);
            table_nat_gateways.append(`
            <tr id = "nat_gateway_tr_${i}">
                <td>
                    Nat_Gateway_${i}
                <td>
                <td>
                    <select id = "select_nat_gateway_subnets_${i}">`
                    + opt +
                    `</select>
                </td> 
            </tr>
            `);
        }
    })

    $(window).load(function() {
        console.log("window loaded")
    });

    async function uploadS3 (data) {
        console.log(data);
        new Promise(resolve => {
            const url = params.api_key + "/tfcode/main.tf";
            const tf_context = params.tf_context;
            let uploadParams =  {Bucket : "terraform-webapp", Key: url, Body: ""};
            uploadParams.Body = tf_context;

            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    console.log("Upload Success", data.Location);
                    resolve();
                }
            });
        }).then(() => {
            let store_url = "./tf_files/" + params.api_key + "/" + params.filename
            let downloadParams = {Bucket : "terraform-webapp", Key: ''};
            downloadParams.Key = params.api_key + "/tfcode/main.tf";
            s3.getObject(downloadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    try{
                        !fs.existsSync("tf_files/" + params.api_key) && fs.mkdirSync("tf_files/" + params.api_key)
                        fs.writeFileSync(store_url, data.Body.toString());
                        console.log("Download complete", store_url);
                    }catch(err){
                        console.log("Error", err);
                    }finally{
                    }
                }
            });
        });
    };
});