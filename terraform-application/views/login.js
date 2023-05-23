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

    socket.on('login_success', function(data) {
        console.log("redirect");
        destination = '/dashboard';
        window.location.href = destination;
    });
});

function signup(data) { 
    const user_pool_id = data.UserPoolId;
    const client_id = data.ClientId;

    const email = data.email;

    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    console.log(CognitoUserPool);
    
    var poolData = {
        UserPoolId: user_pool_id, // Your user pool id here
        ClientId: client_id, // Your client id here
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: 'hm.kim@smileshark.kr',
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    var dataName = {
        Name: 'name',
        Value: 'hm.kim',
    };
    var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

    attributeList.push(attributeName);

    userPool.signUp('hm.kim@smileshark.kr', 'Smileshark12!@', attributeList, null, function(
        err,
        result
    ) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        var cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
};

function validate() { 
    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    console.log(CognitoUserPool);
    
    var poolData = {
        UserPoolId: 'ap-northeast-2_xEi26vjyg', // Your user pool id here
        ClientId: '49s6ilr4f22n4b6ug3s1vum2tb', // Your client id here
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: 'hm.kim@smileshark.kr',
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration("698344", true, function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('call result: ' + result);
    });
};