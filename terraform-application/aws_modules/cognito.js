require('dotenv').config();
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

exports.signIn = function (data) {
    return new Promise((resolve, reject) => {
        console.log("email : " + data.email + " password : " + data.passwd);
        const user_pool_id = process.env.USERPOOLID;
        const client_id = process.env.CLIENTID;

        const email = data.email;
        const passwd = data.passwd;

        const userPoolData = {
            UserPoolId: user_pool_id, // Your user pool id here
            ClientId: client_id
        }

        const userData = {
            Username: email,
            Pool: new AmazonCognitoIdentity.CognitoUserPool(userPoolData)
        }

        const authenticationData = {
            Username: email,
            Password: passwd
        }

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                let jwt = result.getIdToken().getJwtToken();
                console.log("jwt token : ", jwt);
                resolve("ok");
            },
            onFailure: function (err) {
                console.log("error");
                reject("none");
            }
        });
    });
}

exports.signUp = function (data){
    return new Promise((resolve, reject) => {
        console.log("email : " + data.email + " password : " + data.passwd);
        const user_pool_id = process.env.USERPOOLID;
        const client_id = process.env.CLIENTID;

        const email = data.email;
        const passwd = data.passwd;
    
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
    });
}

exports.validate = function (data){
    return new Promise((resolve, reject) => {
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
    });
}