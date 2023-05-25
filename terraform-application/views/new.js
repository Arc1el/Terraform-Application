// $(document).off("click", '[id^="delete_sg_btn_"]').on("click", '[id^="delete_sg_btn_"]', function(event) {
//     console.log("Asdf");
//     console.log($(this).attr("id"));
// });

$(document).ready(function() {
    const socket = io();
    var table_pub_subnets = $("#pub_subnet_tr");
    var table_priv_subnets = $("#priv_subnet_tr");
    var table_db_subnets = $("#db_subnet_tr");
    var table_nat_gateways = $("#nat_gateway_tr");


    document.querySelector("input[name=ec2_checkbox]").addEventListener("change", function(){
        if (this.checked) {
            console.log("visible")
            $("#ec2_div").removeClass("invisible").addClass("visible");
        }else{
            $("#ec2_div").removeClass("visible").addClass("invisible");
        }
    });

    document.querySelector("#select_pub_subnets").addEventListener("change", function(){
        console.log("select_pub_subnets");
        console.log("ok"); 
        table_pub_subnets.html("");
        table_nat_gateways.html("");
        let len = $(this).val();

        for (var i = 0; i <len; i++) {
            table_pub_subnets.append(`
            <tr>
                <td>
                    Public Subnet [${i}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                    <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" name ="az" id="select_pub_az_${i}">
                        <option value = a selected>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                    <input class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow gen_sub_input_cidr" placeholder="10.0.${i+1}.0/24" type="text" name="cidr" id="pub_subnet_${i}_cidr">&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" name ="pub" id="select_pub_subnets_${i}">
                    <option value = non >None</option>
                    <option value = igw selected>Internet Gateway</option>
                    <option value = nat>Nat Gateway</option>
                </select>
                </td>
            </tr>
            `) 
        }
    });
    document.querySelector("#select_priv_subnets").addEventListener("change", function(){
        console.log("select_db_subnets");
        console.log("ok"); 
        table_priv_subnets.html("");
        let len = $(this).val();

        for (var i = 0; i <len; i++) {
            table_priv_subnets.append(`
            <tr>
                <td>
                    Private Subnet [${i}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                    <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" name ="az" id="select_priv_az_${i}">
                        <option value = a selected>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                    <input class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow gen_sub_input_cidr" placeholder="10.0.2${i+1}.0/24" type="text" name="cidr" id="priv_subnet_${i}_cidr">&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" name ="priv" id="select_priv_subnets_${i}">
                    <option value = non >None</option>
                    <option value = igw>Internet Gateway</option>
                    <option value = nat selected>Nat Gateway</option>
                </select>
                </td>
            </tr>
            `) 
        }
    });
    document.querySelector("#select_db_subnets").addEventListener("change", function(){
        console.log("select_db_subnets2");
        console.log("ok"); 
        table_db_subnets.html("");
        let len = $(this).val();

        for (var i = 0; i <len; i++) {
            table_db_subnets.append(`
            <tr>
                <td>
                    Database Subnet [${i}]&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                    <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" name ="az" id="select_db_az_${i}">
                        <option value = a selected>A</option>
                        <option value = b>B</option>
                        <option value = c>C</option>
                    </select>&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                    <input class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow gen_sub_input_cidr" placeholder="10.0.3${i+1}.0/24" type="text" name="cidr" id="db_subnet_${i}_cidr">&nbsp;&nbsp;&nbsp;
                </td>
                <td>
                <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" name ="db" id="select_db_subnets_${i}">
                    <option value = non selected>None</option>
                    <option value = igw>Internet Gateway</option>
                    <option value = nat>Nat Gateway</option>
                </select>
                </td>
            </tr>
            `) 
        }
    });

    document.querySelector("#select_nat_gateway").addEventListener("change", function(){
        table_nat_gateways.html("");
        let len     = $(this).val(); 
        let pub_len = $("#select_pub_subnets").val();
        for (var i = 0; i < len; i++) {
            opt = "";
            for (var j = 0; j <pub_len; j++) {
                opt +=`<option value="${j}">Public_Subnet_${j}</option>`
            };
            console.log("opt : ", opt);
            if (opt === "") {
                opt = `<option value=0>퍼블릭 서브넷을 먼저 선택해주세요</`
            }
            table_nat_gateways.append(`
            <tr>
                <td>
                    Nat Gateway [${i}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <td>
                <td>
                    <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow gen_sub_input_cidr" id = "select_nat_gateway_subnets_${i}">`
                    + opt +
                    `</select>
                </td> 
            </tr>
            `);
        }
    });


    socket.on('log_health', function(data) {
        // var textarea_str = $("#terraform-output").val();
        // textarea_str += data;
        // $("#terraform-output").html(textarea_str);
        // const top = $('#terraform-output').prop('scrollHeight');
        // $('#terraform-output').scrollTop(top);
        console.log("tf_log : " + data);
        var tf_div_data = $("#terraform-output").val();
        tf_div_data += data;
        $("#terraform-output").append("<p>" + tf_div_data + "</p><br>");
        const top = $('#terraform-output').prop('scrollHeight');
        $('#terraform-output').scrollTop(top); 
    });

    socket.on('tf_log', function(data) {
        console.log("tf_log : " + data);
        var tf_div_data = $("#terraform-output").val();
        tf_div_data += data;
        $("#terraform-output").append("<p>" + tf_div_data + "</p><br>");
        const top = $('#terraform-output').prop('scrollHeight');
        $('#terraform-output').scrollTop(top); 
    })

    document.querySelector("#select_nat_gateway").addEventListener("change", function(){
        table_nat_gateways.html("");
        let len     = $(this).val(); 
        let pub_len = $("#select_pub_subnets").val();
        for (var i = 0; i < len; i++) {
            opt = "";
            for (var j = 0; j <pub_len; j++) {
                opt +=`<option value="${j}">Public_Subnet_${j}</option>`
            };
            console.log("opt : ", opt);
            if (opt === "") {
                opt = `<option value=0>퍼블릭 서브넷을 먼저 선택해주세요</`
            }
            table_nat_gateways.append(`
            <tr>
                <td>
                    Nat Gateway [${i}]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <td>
                <td>
                    <select class="text-right min-w-full pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow gen_sub_input_cidr" id = "select_nat_gateway_subnets_${i}">`
                    + opt +
                    `</select>
                </td> 
            </tr>
            `);
        }
    });


    document.querySelector("#add_sg_btn").addEventListener("click", (event) => {
        // $('[id^="delete_sg_btn_"]').on("click", (event) => {
        //     console.log("Asdf");
        //     console.log($(event.currentTarget).attr("id")); 
        // });

        counter = Number($("#sg_count").text()) + 1;
        $("#sg_count").text(counter); 
        console.log(counter);
        event.preventDefault();
        context = `
<br>
<div id="sg_div" class="relative flex h-full min-w-0 flex-col break-words"> 
<div class="border-black/12.5 shadow-soft-2xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border p-4" >
<table>
<tr>
<td>
<b>Security Group Name</b>
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/2 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="My Security Group" type="text" id="sg_name_${counter}">
</td>
</tr>
</table>
<table>
<tr>
<td>
<b>Security Group Description</b>
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/2 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="SG Description" type="text" id="sg_description_${counter}">
</td>
</tr>
</table> 
<table  id="ingress_table_${counter}">
<tr>
<td>
<b>Ingress</b>&nbsp;&nbsp;&nbsp;
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="비워 둘 시 생성안됨" type="text" id="ingress_description_${counter}_0" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="From" type="text" id="ingress_from_${counter}_0" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="To" type="text" id="ingress_to_${counter}_0" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="TCP" type="text" id="ingress_protocol_${counter}_0" />
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0.0.0.0/0" type="text" id="ingress_cidr_${counter}_0" />
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="Description" type="text" id="ingress_description_${counter}_1" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="From" type="text" id="ingress_from_${counter}_1" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="To" type="text" id="ingress_to_${counter}_1" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="TCP" type="text" id="ingress_protocol_${counter}_1" />
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0.0.0.0/0" type="text" id="ingress_cidr_${counter}_1" />
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="Description" type="text" id="ingress_description_${counter}_2" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="From" type="text" id="ingress_from_${counter}_2" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="To" type="text" id="ingress_to_${counter}_2" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="TCP" type="text" id="ingress_protocol_${counter}_2" />
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0.0.0.0/0" type="text" id="ingress_cidr_${counter}_2" />
</td>
</tr>
</table>
<table id="sg_egress_table_${counter}">
<tr>
<td>
<b>Egress</b>&nbsp;&nbsp;&nbsp;
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="비워 둘 시 생성안됨" type="text" id="egress_description_${counter}_0" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0" type="text" id="egress_from_${counter}_0" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0" type="text" id="egress_to_${counter}_0" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="-1" type="text" id="egress_protocol_${counter}_0" />
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0.0.0.0/0" type="text" id="egress_cidr_${counter}_0" />
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="Description" type="text" id="egress_description_${counter}_1" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="From" type="text" id="egress_from_${counter}_1" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="To" type="text" id="egress_to_${counter}_1" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="TCP" type="text" id="egress_protocol_${counter}_1" />
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0.0.0.0/0" type="text" id="egress_cidr_${counter}_1" />
</td>
</tr>
<tr>
<td>
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="Description" type="text" id="egress_description_${counter}_2" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="From" type="text" id="egress_from_${counter}_2" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="To" type="text" id="egress_to_${counter}_2" />
<input
class="min-w-full w-16 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="TCP" type="text" id="egress_protocol_${counter}_2" />
<input
class="min-w-full w-1/12 pl-3 text-sm focus:shadow-soft-primary-outline rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
placeholder="0.0.0.0/0" type="text" id="egress_cidr_${counter}_2" />
</td>
</tr>
</table> 
</div>
</div>
        `
        counter += 1;
        $("#sg_div").append(context);

    });

    // document.querySelector('#health_check_form').addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     socket.emit('health_check', {});
    // });

    document.querySelector('#create_providers_btn').addEventListener('click', (event) => {
        console.log('create_provider_btn clicked');
        event.preventDefault();
        const access_key    = $('#access_key').val();
        const secret_key    = $('#secret_key').val();
        const region        = $('#region').val();
        const title       = $('#title').val();
        console.log("sk: " + secret_key);
        socket.emit('create_providers', {access_key, secret_key, region, title}); 
    });

    document.querySelector('#tf_validate_btn').addEventListener('click', (event) => {
        event.preventDefault();
        var access_key = $('#access_key').val();
        var title = $('#title').val();
        console.log(access_key);
        socket.emit('terraform_validate', {access_key, title});
    })

    document.querySelector('#tf_init_btn').addEventListener('click', (event) => {
        event.preventDefault();
        var access_key = $('#access_key').val();
        var title = $('#title').val();
        console.log(access_key);
        socket.emit('terraform_init', {access_key, title});
    })
    document.querySelector('#tf_plan_btn').addEventListener('click', (event) => {
        event.preventDefault();
        var access_key = $('#access_key').val();
        var title = $('#title').val();
        console.log(access_key);
        socket.emit('terraform_plan', {access_key, title});
    })
    document.querySelector('#tf_apply_btn').addEventListener('click', (event) => {
        event.preventDefault();
        var access_key = $('#access_key').val();
        var title = $('#title').val();
        console.log(access_key);
        socket.emit('terraform_apply', {access_key, title});
    })
    document.querySelector('#tf_destroy_btn').addEventListener('click', (event) => {
        event.preventDefault();
        var access_key = $('#access_key').val();
        var title = $('#title').val();
        console.log(access_key);
        socket.emit('terraform_destroy', {access_key, title});
    })

    document.querySelector('#create_vpc_btn').addEventListener('click', (event) => {
        console.log('create_vpc_btn clicked', event);
        event.preventDefault();
        var title               = $('#title').val(); 
        var vpc_cidr            = $('#vpc_cidr').val();
        if (!vpc_cidr) vpc_cidr = '10.0.0.0/16';

        const public_subnet_count   = $('#select_pub_subnets').val();
        const private_subnet_count  = $('#select_priv_subnets').val();
        const database_subnet_count = $('#select_db_subnets').val();
        const nat_count             = $('#select_nat_gateway').val();
        const access_key            = $('#access_key').val(); 
        
        //public subnet data
        var public_subnet_data = [];
        for (let i = 0; i < public_subnet_count; i++) {
            let az = $(`#select_pub_az_${i}`).val();
            let cidr = $(`#pub_subnet_${i}_cidr`).val();
            if (!cidr) cidr = `10.0.${i+1}.0/24`;
            let gate = $(`#select_pub_subnets_${i}`).val();
            let data = {index: i, az: az, cidr: cidr, gateway: gate}
            public_subnet_data.push(data);
        }
        console.log("public_subnet_data : " + public_subnet_data);
        
        //private subnet data
        var private_subnet_data = [];
        for (let i = 0; i < private_subnet_count; i++) {
            let az = $(`#select_priv_az_${i}`).val();
            let cidr = $(`#priv_subnet_${i}_cidr`).val();
            if (!cidr) cidr = `10.0.2${i+1}.0/24`;
            let gate = $(`#select_priv_subnets_${i}`).val();
            let data = {index: i, az: az, cidr: cidr, gateway:gate}
            private_subnet_data.push(data);
        }
        
        //database subnet data
        var database_subnet_data = [];
        for (let i = 0; i < database_subnet_count; i++) {
            let az = $(`#select_db_az_${i}`).val();
            let cidr = $(`#db_subnet_2${i}_cidr`).val();
            if (!cidr) cidr = `10.0.3${i+1}.0/24`;
            let gate = $(`#select_db_subnets_${i}`).val();
            let data = {index: i, az: az, cidr: cidr, gateway:gate}
            database_subnet_data.push(data); 
        }
        
        //nat gatewat data
        var nat_gateway_data = [];
        for (let i = 0; i < nat_count; i++) {
            let created_subnet = $(`#select_nat_gateway_subnets_${i}`).val();
            nat_gateway_data.push(created_subnet);
        }
        
        // send data to "create_vpc" socket
        socket.emit('create_vpc', {access_key, title, vpc_cidr, public_subnet_data, private_subnet_data, database_subnet_data, nat_gateway_data, title});
    });
    

    document.querySelector('#create_sg_btn').addEventListener('click', (event) => {
        console.log('create_sg_btn clicked');
        event.preventDefault();
        counter = Number($("#sg_count").text()) + 1;
        console.log("sg count : " , counter)
        var name = [];  
        var description = [];
        var ingress = [];
        var egress = [];
        var access_key = $('#access_key').val();
        var title = $('#title').val();
        var sg_description = $('')

        // if (!vpc_cidr) vpc_cidr = '10.0.0.0/16';
        for (var i = 0; i < counter; i++) {
            name.push($(`#sg_name_${i}`).val());
            description.push($(`#sg_descirption_${i}`).val());
            let ingress_data = []; 
            for (let j = 0; j <= 2; j++) {
                let ingress_description = $(`#ingress_description_${i}_${j}`).val();
                
                if (ingress_description) {
                let ingress_from = $(`#ingress_from_${i}_${j}`).val();
                let ingress_to = $(`#ingress_to_${i}_${j}`).val();
                let ingress_protocol = $(`#ingress_protocol_${i}_${j}`).val();
                let ingress_cidr = $(`#ingress_cidr_${i}_${j}`).val();
                
                ingress_data.push(ingress_description);
                ingress_data.push(ingress_from);
                ingress_data.push(ingress_to);
                ingress_data.push(ingress_protocol);
                ingress_data.push(ingress_cidr);
                }
            } 
            ingress.push(ingress_data);

            let egress_data = []; 
            for (let j = 0; j <= 2; j++) {
                let egress_description = $(`#egress_description_${i}_${j}`).val();
                
                if (egress_description) {
                let egress_from = $(`#egress_from_${i}_${j}`).val();
                let egress_to = $(`#egress_to_${i}_${j}`).val();
                let egress_protocol = $(`#egress_protocol_${i}_${j}`).val();
                let egress_cidr = $(`#egress_cidr_${i}_${j}`).val();
                
                egress_data.push(egress_description);
                egress_data.push(egress_from);
                egress_data.push(egress_to);
                egress_data.push(egress_protocol);
                egress_data.push(egress_cidr);
                }
            } 
            egress.push(egress_data);
        }
        console.log(name);
        console.log(description);
        console.log(ingress);
        console.log(egress) 
        
        socket.emit('create_sg', {access_key, title, name, description, ingress, egress});
    });
});