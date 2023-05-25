$(document).ready(function (){
    const socket = io();


    document.querySelector('#loginBtn').addEventListener('click', (event) => {
        event.preventDefault();
        console.log("btn clicked!");
        const id    = $('#cognitoId').val();
        const pw    = $('#cognitoPw').val();

        const data = {
            id: id,
            pw: pw
        }

        $.post("/api/login", data, function(data, res){
            console.log(data, res);
        })
    })
});