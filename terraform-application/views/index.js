$(document).ready(function() {
    const socket = io();
    socket.on('log_health', function(data) {
        console.log(data);
        var textarea_str = $("#log-health").val();
        console.log(textarea_str);
        textarea_str += data;
        $("#log-health").html(textarea_str); 
    });
    document.querySelector('#config-form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        const api = document.querySelector('#api').value;
        const secret = document.querySelector('#secret').value;
        const tf_contents = document.querySelector('#tf-contents').value;
        const log_health = document.querySelector('#log-health').value;
        
        socket.emit('cmd_req', { api, secret, tf_contents });
    });
    document.querySelector('#health_check_form').addEventListener('submit', (event) => {
        event.preventDefault();
        socket.emit('health_check', {});
    });
    document.querySelector('#vpc-form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        socket.emit('health_check', {});
    });

    var table_pub_subnets = $("#pub_subnet_tr");
    var table_priv_subnets = $("#priv_subnet_tr");
    var table_db_subnets = $("#table_db_subnets");
    var table_nat_gateways = $("#table_nat_gateways");

    $("#select_pub_subnets").change(function() {
        table_pub_subnets.html("");
        table_nat_gateways.html("");
        let len = $(this).val();
        for (var i = 0; i <len; i++) {
            table_pub_subnets.append(`
            <tr>
                <td>
                    Public_Subnet_${i}
                </td>
                <td>
                    <select name ="az" id="select_pub_az">
                        <option value = a selectd>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>
                </td>
                <td>
                    <input class="gen_sub_input_cidr" placeholder="10.0.${i+1}.0/24" type="text" name="cidr" id="db_subnet_${i}_cidr">
                </td>
                <td>
                <select name ="pub" id="select_pub_subnets">
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
                    Private_Subnet_${i}
                </td>
                <td>
                    <select name ="az" id="select_priv_az">
                        <option value = a selectd>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>
                </td>
                <td>
                    <input class="gen_sub_input_cidr" placeholder="10.0.2${i+1}.0/24" type="text" name="cidr" id="db_subnet_${i}_cidr">
                </td>
                <td>
                <select name ="priv" id="select_priv_subnets">
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
                    Database_Subnet_${i}
                </td>
                <td>
                    <select name ="az" id="select_db_az">
                        <option value = a selectd>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>
                </td>
                <td>
                    <input class="gen_sub_input_cidr" placeholder="10.0.3${i+1}.0/24" type="text" name="cidr" id="db_subnet_${i}_cidr">
                </td>
                <td>
                <select name ="pub" id="select_pub_subnets">
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
});