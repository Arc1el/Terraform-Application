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
var s3 = require('./aws_modules/s3');

//Logging to Browser
var logger = require('./socket_logger/logger');

//Terraform
var terraform = require('./terraform_modules/terraform');
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
      logger.logSeperate({socket, msg : "*** Server is now Available ***"});
      terraform.version({socket});
    });

    socket.on('create_providers', (data) => {
      logger.logSeperate({socket, msg : "create Providers.tf..."});
      const region      = data.region;
      const access_key  = data.access_key;
      const secret_key  = data.secret_key;
      const project     = data.project;
      const arn         = data.arn;
      
      !fs.existsSync("tf_files/" + access_key) && fs.mkdirSync("tf_files/" + access_key, {recursive: true});
      let providers_context = provider.createProviders({region, access_key, secret_key, project, arn});
      socket.emit('log_health', providers_context);
      s3.upload({access_key: access_key, filename: "providers.tf", socket: socket, context: providers_context});
      logger.logSeperate({socket, msg : "create Providers.tf Successfully!!"});
    });
    
    socket.on('create_vpc', (data) => {
      logger.logSeperate({socket, msg : "create VPC.tf..."});
      const access_key            = data.access_key;
      const title                 = data.title;
      const vpc_cidr              = data.vpc_cidr;
      const public_subnet_data    = data.public_subnet_data;
      const private_subnet_data   = data.private_subnet_data;
      const database_subnet_data  = data.database_subnet_data;
      const nat_gateway_data      = data.nat_gateway_data;

      !fs.existsSync("./tf_files/" + access_key) && fs.mkdirSync("./tf_files/" + access_key);
      let vpc_tf_context = vpc.createVpc({title, vpc_cidr, public_subnet_data, private_subnet_data, database_subnet_data, nat_gateway_data})
      socket.emit('log_health', vpc_tf_context);
      s3.upload({access_key: access_key, filename: "vpc.tf", socket: socket, context: vpc_tf_context});
      logger.logSeperate({socket, msg : "create VPC.tf Successfully!!"});
    });
    
    socket.on('terraform_init', (data) => {
      logger.logSeperate({socket, msg : "Terraform Initialization"});
      const access_key = data.access_key;
      !fs.existsSync("./tf_files/" + access_key) && fs.mkdirSync("./tf_files/" + access_key);
      terraform.init({socket, path : access_key}); 
    });

    socket.on('terraform_plan', (data) => {
      logger.logSeperate({socket, msg : "Terraform Plan"});
      const access_key = data.access_key;
      !fs.existsSync("./tf_files/" + access_key) && fs.mkdirSync("./tf_files/" + access_key);
      terraform.plan({socket, path : access_key}); 
    });

    socket.on('terraform_apply', (data) => {
      logger.logSeperate({socket, msg : "Terraform Apply"});
      const access_key = data.access_key;
      !fs.existsSync("./tf_files/" + access_key) && fs.mkdirSync("./tf_files/" + access_key);
      terraform.apply({socket, path : access_key}); 
    });

    socket.on('terraform_destroy', (data) => {
      logger.logSeperate({socket, msg : "Terraform Destroy"});
      const access_key = data.access_key;
      !fs.existsSync("./tf_files/" + access_key) && fs.mkdirSync("./tf_files/" + access_key);
      terraform.destroy({socket, path : access_key}); 
    });

  }catch (e) {
    logger.logging(e);
    console.error(e);
  }finally {}
});
module.exports = app;
