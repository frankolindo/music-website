const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/articles');
const usersRouter = require('./routes/users');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const config = require('./config/database');
//connect mongoose to data base
mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;
//check db connection
db.once('open', function(){
	console.log('Connected to mongodb');
});

//check for database errors
db.on('error', function(err){
	console.log(err);
});


//init app
const app = express();

//bodyprase application
app.use(bodyParser.urlencoded({extended: true}));
//prase application/json
app.use(bodyParser.json());

//load views engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//route inside public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
	// cookie: {secure: true}
}));

//Express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//Express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User Globa viarable
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});

let Article = require('./modules/articleModule');

app.get('/', function(req, res){
	Article.find({}, function(err, articles){
		if(err){
			console.log(err);
		}
		else{
			res.render('index', { title: 'Articles',
    		articles: articles
			});
		}
  });
});

//I MEAN HERE IS MY ROUTER!!!!
app.use('/', indexRouter);
app.use('/users', usersRouter);

//start server
app.listen(3000, function(){
	console.log('server started on port 3000.....');
});
