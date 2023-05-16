var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//AWS
var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-2'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
var s3_2 = require('./aws_modules/s3');

//Terraform
const { spawn } = require('child_process');
var provider = require('./terraform_modules/provider');
var vpc = require('./terraform_modules/vpc');

app.io.on('connection', async (socket) => {
  try{
    console.log("socket connection established");
    socket.on('disconnect', () =>{
      console.log("socket disconnected");
      socket.emit('log_health', () => {
        return "socket";
      })
    });

    socket.on('health_check', (data) => {
      var msg_available = "==============================================\n"
      msg_available += "*** Server is now Available ***\n==============================================\n"
      socket.emit('log_health', msg_available);
      const terraform_init = spawn('terraform', ['-v']);
          //`-chdir=${tf_file_path}`
          terraform_init.stdout.on('data', (data) => {
            console.log(data.toString());
            socket.emit('log_health', data.toString()); 
          }); 
          terraform_init.stderr.on('data', (data) => {
            console.error(data.toString());
          }); 
          terraform_init.on('exit', (code) => {
            if (code === 0) {
              console.log('Terraform init succeeded');
              socket.emit('log_health', "\n");
            } else {
              console.error('Terraform init failed');
            }
      });
    });

    socket.on('create_providers', (data) => {
      socket.emit('log_health', "==============================================\n");
      socket.emit('log_health', "create Providers.tf...\n");
      socket.emit('log_health', "==============================================\n");
      console.log(data);
      const region = data.region;
      const access_key = data.access_key;
      const secret_key = data.secret_key;
      const project = data.project;
      const arn = data.arn;

      console.log("in careate_providers ", region, access_key, secret_key, project, arn);
      
      providers_context = provider.createProviders({region, access_key, secret_key, project, arn});
      s3_res = s3_2.s3Upload({access_key: access_key, filename: "providers.tf", socket: socket, context: providers_context});

      socket.emit('log_health', providers_context);
      socket.emit('log_health', "==============================================\n");
      socket.emit('log_health', "create Providers.tf Successfully!!\n");
      socket.emit('log_health', "==============================================\n\n");
    });
    
    socket.on('create_vpc', (data) => {
      socket.emit('log_health', "==============================================\n");
      socket.emit('log_health', "create VPC.tf...\n");
      socket.emit('log_health', "==============================================");
      console.log("data received: ");
      console.log(data)

      const access_key = data.access_key;
      const title = data.title;
      const vpc_cidr = data.vpc_cidr;
      const public_subnet_data = data.public_subnet_data;
      const private_subnet_data = data.private_subnet_data;
      const database_subnet_data = data.database_subnet_data;
      const nat_gateway_data = data.nat_gateway_data;
      console.log("nat_gateway_data : ", nat_gateway_data)
      vpc_tf_context = vpc.createVpc({title, vpc_cidr, public_subnet_data, private_subnet_data, database_subnet_data, nat_gateway_data})
      console.log(vpc_tf_context);

      console.log("key value : ", access_key)

      s3_res = s3_2.s3Upload({access_key: access_key, filename: "vpc.tf", socket: socket, context: vpc_tf_context});
      // new Promise(resolve => {
      //   const url = api + "/tfcode/vpc.tf";
      //   let uploadParams =  {Bucket : "terraform-webapp", Key: url, Body: ""};
      //   uploadParams.Body = vpc_tf_context;

      //   s3.upload(uploadParams, function (err, data) {
      //       if (err) {
      //           console.log("Error", err);
      //       } if (data) {
      //           console.log("Upload Success", data.Location);
      //           resolve();
      //       }
      //   });

      //   }).then(() => {
      //       let store_url = "./tf_files/" + api + "/vpc.tf";
      //       let downloadParams = {Bucket : "terraform-webapp", Key: ''};
      //       downloadParams.Key = api + "/tfcode/vpc.tf";
      //       s3.getObject(downloadParams, function (err, data) {
      //           if (err) {
      //               console.log("Error", err);
      //           } if (data) {
      //               try{
      //                   !fs.existsSync("tf_files/" + api) && fs.mkdirSync("tf_files/" + api)
      //                   fs.writeFileSync(store_url, data.Body.toString());
      //                   console.log("Download complete", store_url);
      //               }catch(err){
      //                   console.log("Error", err);
      //               }finally{
      //               }
      //           }
      //       });
      //   }).then(() => {
      //     socket.emit('log_health', vpc_tf_context);
      //     socket.emit('log_health', "\n==============================================\n");
      //     socket.emit('log_health', "create VPC.tf Successfully!!\n");
      //     socket.emit('log_health', "==============================================\n\n");
      //   })
    });

    socket.on('cmd_req', async (data) => {
      var api_key = data.api;
      var secret_key = data.secret;

      !fs.existsSync("tf_files") && fs.mkdirSync("tf_files");

      var tf_context = "";
      tf_context += provider.getProviders();
      tf_context += vpc.createVpc();
      console.log(tf_context);
      var filename = "main.tf";

      const tf_file_path = path.join(__dirname, "./tf_files/" + api_key );
      console.log (tf_file_path);

      async function terraformPipeExcution (params) {
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
        }).then(() => {
          const terraform_init = spawn('terraform', [`-chdir=${tf_file_path}`, 'init']);
          //`-chdir=${tf_file_path}`
          terraform_init.stdout.on('data', (data) => {
            console.log(data.toString());
            socket.emit('log_health', data.toString()); 
          }); 
          terraform_init.stderr.on('data', (data) => {
            console.error(data.toString());
          }); 
          terraform_init.on('exit', (code) => {
            if (code === 0) {
              console.log('Terraform init succeeded');
            } else {
              console.error('Terraform init failed');
            }
          });
        // }).then(() => {
        //   const terraform_plan = spawn('terraform', [`-chdir=${tf_file_path}`, 'plan']);
        //   //`-chdir=${tf_file_path}`
        //   terraform_plan.stdout.on('data', (data) => {
        //     console.log(data.toString());
        //   }); 
        //   terraform_plan.stderr.on('data', (data) => {
        //     console.error(data.toString());
        //   }); 
        //   terraform_plan.on('exit', (code) => {
        //     if (code === 0) {
        //       console.log('Terraform plan succeeded');
        //     } else {
        //       console.error('Terraform plan failed');
        //     }
        //   });
        // }).then(() => {
        //   const terraform_plan = spawn('terraform', [`-chdir=${tf_file_path}`, 'apply', '-auto-approve']);
        //   //`-chdir=${tf_file_path}`
        //   terraform_plan.stdout.on('data', (data) => {
        //     console.log(data.toString());
        //   }); 
        //   terraform_plan.stderr.on('data', (data) => {
        //     console.error(data.toString());
        //   }); 
        //   terraform_plan.on('exit', (code) => {
        //     if (code === 0) {
        //       console.log('Terraform apply succeeded');
        //     } else {
        //       console.error('Terraform apply failed');
        //     }
        //   });
        // }).then(() => {
        //   const terraform_plan = spawn('terraform', [`-chdir=${tf_file_path}`, 'destroy', '-auto-approve']);
        //   //`-chdir=${tf_file_path}`
        //   terraform_plan.stdout.on('data', (data) => {
        //     console.log(data.toString());
        //   }); 
        //   terraform_plan.stderr.on('data', (data) => {
        //     console.error(data.toString());
        //   }); 
        //   terraform_plan.on('exit', (code) => {
        //     if (code === 0) {
        //       console.log('Terraform destroy succeeded');
        //     } else {
        //       console.error('Terraform destroy failed');
        //     }
        //   });
        });
      }
      await terraformPipeExcution({api_key, tf_context, filename});
    }); 
  }catch (e) {

  }finally {

  }
});
module.exports = app;
