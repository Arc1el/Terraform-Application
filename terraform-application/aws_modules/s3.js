var AWS     = require('aws-sdk');
var fs      = require('fs');

AWS.config.update({region: 'ap-northeast-2'});
const s3    = new AWS.S3({apiVersion: '2006-03-01'});

exports.upload = function(data) {
    var context = data.context;
    const socket = data.socket;
    const filename = data.filename;
    const access_key = data.access_key;

    console.log("upload to s3", filename, access_key);

    new Promise(resolve => {
        !fs.existsSync(access_key) && fs.mkdirSync(access_key);
        const url = access_key + "/tfcode/" + filename;
        let uploadParams =  {Bucket : "terraform-webapp", Key: url, Body: ""};
        uploadParams.Body = context;

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            } if (data) {
                console.log("Upload Success", data.Location);
                resolve();
            }
        });

        }).then(() => {
            let store_url = "./tf_files/" + access_key + "/" + filename;
            let downloadParams = {Bucket : "terraform-webapp", Key: ''};
            downloadParams.Key = access_key + "/tfcode/" + filename;
            s3.getObject(downloadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    try{
                        !fs.existsSync("tf_files/" + access_key) && fs.mkdirSync("tf_files/" + access_key)
                        fs.writeFileSync(store_url, data.Body.toString());
                        console.log("Download complete", store_url);
                    }catch(err){
                        console.log("Error", err);
                    }finally{
                    }
                }
            });
        })
}